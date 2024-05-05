#!/bin/sh
curl -o "geonames-all-cities-with-a-population-1000.csv" "https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/exports/csv?lang=fr&timezone=Europe%2FBerlin&use_labels=true&delimiter=%3B"
python format.py
mv output-db.json ..