# adapted from elotroalex/itsb

import os
import csv
import codecs
import json
import datetime
import re
from geopy import geocoders
import pycountry


class bcolors:
    OKGREEN = "\033[92m"
    WARNING = "\033[93m"
    FAIL = "\033[91m"
    ENDC = "\033[0m"


# old color palette

# author_colors = {
#     "acesaire": [252, 176, 64, 166],    # FCB040
#     "dali": [108, 60, 150, 166],        # 6C3C96
#     "egrobeson": [254, 114, 52, 166],   # FE7234
#     "kbrathwaite": [0, 216, 226, 166],  # 00D8E2
#     "kdunham": [114, 193, 102, 166],    # 72C166
#     "mconde": [117, 128, 58, 166],      # 75803A
#     "wlam": [58, 95, 227, 166],         # 3A5FE3
# }

# new color palette generated with seaborn;
# can use seaborn with larger n_colors when adding more people

palette = [
    [2, 62, 255, 195],
    [255, 124, 0, 195],
    [26, 201, 56, 195],
    [232, 0, 11, 195],
    [139, 43, 226, 195],
    [159, 72, 0, 195],
    [241, 76, 193, 195],
    [163, 163, 163, 195],
    [255, 196, 0, 195],
    [0, 215, 255, 195],
    [0, 28, 127, 195],
    [177, 64, 13, 195],
]

## code provided here, uncomment if you want to add more / change palettes
# from seaborn import color_palette
# from math import ceil
# palette = []
# n_colors = 12
# seaborn_palette_order = ["bright", "dark"]
# for i in range(0, ceil(n_colors / 10)): # each seaborn palette has ~10 colors
#     for (r,g,b) in color_palette(palette=seaborn_palettes[i], n_colors=10):
#         palette.append([int(r*255), int(g*255), int(b*255), 195])
#         if len(palette) == n_colors:
#             break


# ---------
# Settings
# ---------

cwd = os.getcwd()
project_dir = os.path.dirname(cwd)

PLACES_CSV_LOCATION = f"{cwd}/in/places/"
MOVEMENTS_CSV_LOCATION = f"{cwd}/in/movements/"

AUTHOR_ID_JSON = f"{project_dir}/data/authors.json"
ITINERARIES_JSON = f"{project_dir}/data/itineraries.json"
PLACES_JSON = f"{project_dir}/data/places.json"

LOGFILE = f"{cwd}/logs/process_log.txt"
GEONAMES_USERNAME = "alyv"
BASE_URI = "https://sameboats.org"

# ---------
# Logfile
# ---------

logf = open(LOGFILE, "a")

# ----------
# Functions
# ----------

# -------------------------------------------------------------------------
# Returns a list of all the csv files in a directory
# -------------------------------------------------------------------------
def get_csv_list(csv_location):
    csv_list = []

    file_list = os.listdir(csv_location)
    for file in file_list:
        if file.lower().endswith(".csv"):
            csv_list.append(file)

    return csv_list


# -------------------------------------------------------------------------
# Returns the GeoNames latitude and longitude of the place name provided.
# If the place is not found, the function returns None for both longitude and latitude.
# -------------------------------------------------------------------------
def get_lat_long(place_name, geonames_username):
    gn = geocoders.GeoNames(username=geonames_username, timeout=None)
    location = gn.geocode(place_name, timeout=None)
    if location == None:
        message = place_name + " geocode not found"
        print(f"{bcolors.WARNING}{message}{bcolors.ENDC}")
        logf.write(message + "\n")
        return None, None
    else:
        return float(location.latitude), float(location.longitude)


# -------------------------------------------------------------------------
# If the date for the passed key in the row matches none of the date
# regexes, log as an invalid date.
# -------------------------------------------------------------------------
def validate_date(row, row_index, author_name, key):
    date = row[key]
    if all(
        [
            match == None
            for match in [
                re.fullmatch("\d\d\d\d-\d\d-\d\d", date),
                re.fullmatch("\d\d\d\d-\d\d", date),
                re.fullmatch("\d\d\d\d", date),
            ]
        ]
    ):
        message = (
            f"{author_name} ({row_index}): {key} Date {date} is not a valid date entry"
        )
        print(f"{bcolors.FAIL}{message}{bcolors.ENDC}")
        logf.write(message + "\n")


# -------------------------------------------------------------------------
# Returns a JSON-LD ItemList record of authors, and a W3C AnnotationCollection
# with an embedded AnnotationPage, which contains all the Linked trace
# records for trajectories/itineraries
# -------------------------------------------------------------------------
def process_movements(csv_path, places):
    # construct JSON-LD ItemList record for list of authors
    authors = {
        "@context": "http://schema.org",
        "@type": "ItemList",
        "@id": f"{BASE_URI}/authors",
        "itemListElement": [],
    }
    # construct W3C AnnotationCollection record for list of itineraries
    author_movements = {
        "@context": "http://www.w3.org/ns/anno.jsonld",
        "id": f"{BASE_URI}/itineraries",
        "type": "AnnotationCollection",
        "label": "Itineraries",
        "total": 0,
        # one AnnotationPage listing all annotations, for simplicity
        "first": {
            "id": f"{BASE_URI}/itineraries?page=1",
            "type": "AnnotationPage",
            "items": [],
        },
    }

    for (idx, csv_name) in enumerate(get_csv_list(csv_path)):

        with open(csv_path + csv_name) as csv_file:

            reader = csv.reader(csv_file)

            # get the author information from the csv header
            author_info = reader.__next__()
            author_name = author_info[0]
            author_id = f"{authors['@id']}/{author_info[1]}"

            # construct JSON-LD Person record
            person = {
                "@type": "Person",
                "@id": author_id,
                "name": author_name,
                # TODO: figure out how we want to do this programmatically
                "color": palette[idx],
            }

            # construct a Linked Trace record for the author
            linked_trace = {
                "@context": "http://www.w3.org/ns/anno.jsonld",
                "id": f"{author_id}/itineraries/1",
                "type": "Annotation",
                "created": datetime.datetime.utcnow().strftime("%Y-%m-%d"),
                "motivation": "describing",
                "target": [
                    {
                        "id": author_id,
                        "title": author_name,
                    }
                ],
            }
            # include creator info if present
            if author_info[3]:
                linked_trace["creator"] = {"name": author_info[3]}

            movements_list = []

            # read the rest of the csv to get the author's movements
            reader = csv.DictReader(csv_file)
            row_index = 3
            for row in reader:
                place_id = row["PlaceID"] if "PlaceID" in row else row["Place ID"]
                if any(
                    [
                        row["Arrival"],
                        row["Departure"],
                        row["Earliest Presence"],
                        row["Latest Presence"],
                    ]
                ):
                    movement = {}
                    movement["id"] = f"{BASE_URI}/places/{place_id}"

                    # TODO: Determine birthplace, deathplace, other relations
                    if row["Notes"]:
                        movement["relation"] = {
                            "relationType": "waypoint",
                            "label": row["Notes"],
                        }
                    else:
                        movement["relation"] = "waypoint"

                    # append citations
                    if row["Citation 1"] or row["Citation 2"]:
                        movement["citations"] = []
                        if row["Citation 1"]:
                            movement["citations"].append({"label": row["Citation 1"]})
                        if row["Citation 2"] and row["Citation 2"] != row["Citation 1"]:
                            movement["citations"].append({"label": row["Citation 2"]})

                    # look for place in Linked Places records
                    found_place = next(
                        (
                            p
                            for p in places["features"]
                            if p["@id"].split("/")[-1] == place_id
                        ),
                        None,
                    )
                    # log bad place ids
                    if not found_place:
                        message = f"{author_name} ({row_index}): Place ID {place_id} not found in master Place Name list."
                        print(f"{bcolors.FAIL}{message}{bcolors.ENDC}")
                        logf.write(message + "\n")
                        # set title to place id
                        movement["title"] = place_id
                    else:
                        # get title and id from places
                        movement["title"] = found_place["properties"]["title"]
                        movement["id"] = found_place["@id"]

                    # store dates in {when: {timespans}}
                    movement["when"] = {"timespans": []}

                    # Date representation:
                    # - Earliest Presence  | {start: {earliest}}
                    # - Arrival            | {start: {in}}
                    # - Departure          | {end: {in}}
                    # - Latest Presence    | {end: {latest}}

                    # get the start date
                    if row["Arrival"] != "":  # start is arrival
                        movement["when"]["timespans"].append(
                            {"start": {"in": row["Arrival"]}}
                        )
                        # log bad arrival date
                        validate_date(row, row_index, author_name, "Arrival")

                    elif row["Earliest Presence"] != "":  # start is earliest presence
                        movement["when"]["timespans"].append(
                            {"start": {"earliest": row["Earliest Presence"]}}
                        )
                        # log bad earliest presence date
                        validate_date(row, row_index, author_name, "Earliest Presence")

                    # get the end date
                    if row["Departure"] != "":  # end is departure
                        movement["when"]["timespans"].append(
                            {"end": {"in": row["Departure"]}}
                        )
                        # log bad departure date
                        validate_date(row, row_index, author_name, "Departure")

                    elif row["Latest Presence"] != "":  # end is latest presence
                        movement["when"]["timespans"].append(
                            {"end": {"latest": row["Latest Presence"]}}
                        )
                        # log bad latest presence date
                        validate_date(row, row_index, author_name, "Latest Presence")

                    movements_list.append(movement)
                else:
                    message = f"{author_name} ({row_index}): This entry has no key dates listed and has been skipped."
                    print(f"{bcolors.WARNING}{message}{bcolors.ENDC}")
                    logf.write(message + "\n")

                row_index += 1

            # attach movements list as body of Linked Trace record
            linked_trace["body"] = {
                "type": "Dataset",
                "format": "application/json",
                "value": movements_list,
            }

            # attach Linked Trace record to AnnotationPage
            author_movements["first"]["items"].append(linked_trace)

            # attach Person record as itemListElement
            authors["itemListElement"].append(person)

            csv_file.close()
    return authors, author_movements


# -------------------------------------------------------------------------
# Returns a FeatureCollection dictionary containing a list of Linked Places
# {
#   'type': 'FeatureCollection',
#   'features': [{
#       'type': 'Feature',
#       'properties': { '@id': 'https://sameboats.org/places/XXXX 'title': 'XXXXXX', ... },
#       'geometry': { 'coordinates': [###, ###], 'type': 'Point' },
#    }]
# }
# -------------------------------------------------------------------------
def process_places(csv_path, csv_list):
    linked_places = {
        "type": "FeatureCollection",
        "features": [],
    }

    for csv_name in csv_list:
        with open(csv_path + csv_name) as csv_file:
            reader = csv.DictReader(csv_file)
            for row in reader:
                # lookup country code
                ccode = ""
                try:
                    countries = pycountry.countries.search_fuzzy(row["Country"])
                    ccode = countries[0].alpha_2
                except LookupError:
                    message = f"country code not found for {row['PlaceName']}."
                    print(f"{bcolors.WARNING}{message}{bcolors.ENDC}")
                    logf.write(f"{message}\n")
                # construct Linked Places record
                place_id = row["PlaceID"] if "PlaceID" in row else row["Place ID"]
                feature = {
                    "@id": f"{BASE_URI}/places/{place_id}",
                    "type": "Feature",
                    "properties": {
                        "title": row["PlaceName"],
                        "ccodes": [ccode],
                        "timespans": [],
                    },
                    # get geometry from CSV or geonames
                    "geometry": {
                        "type": "Point",
                        "coordinates": (float(row["Long"]), float(row["Lat"]))
                        if row["Lat"] and row["Long"]
                        else get_lat_long(row["PlaceName"], GEONAMES_USERNAME),
                    },
                }
                linked_places["features"].append(feature)

    # prune repeated records by ID
    linked_places["features"] = list(
        {p["@id"]: p for p in linked_places["features"]}.values()
    )

    return linked_places


# ---------------
# Function calls
# ---------------

logf.write(
    "Run time: " + datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S") + "\n\n"
)

places = process_places(PLACES_CSV_LOCATION, get_csv_list(PLACES_CSV_LOCATION))

with codecs.open(PLACES_JSON, "w", "utf8") as f:
    f.write(
        json.dumps(
            places, sort_keys=True, indent=4, separators=(",", ": "), ensure_ascii=False
        )
    )
    f.close()

authors, author_movements = process_movements(MOVEMENTS_CSV_LOCATION, places)

with codecs.open(AUTHOR_ID_JSON, "w", "utf8") as f:
    f.write(
        json.dumps(
            authors,
            sort_keys=True,
            indent=4,
            separators=(",", ": "),
            ensure_ascii=False,
        )
    )
    f.close()

with codecs.open(ITINERARIES_JSON, "w", "utf8") as f:
    f.write(
        json.dumps(
            author_movements,
            sort_keys=True,
            indent=4,
            separators=(",", ": "),
            ensure_ascii=False,
        )
    )
    f.close()


logf.write("\n---------------------------------------------------\n\n\n")
logf.close()
