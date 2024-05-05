import csv, json

class City:
	def __init__(self, name, search_name, lon, lat, country_code):
		self.name = name
		self.search_name = search_name.lower()
		self.lon = lon
		self.lat = lat
		self.country_code = country_code.lower()

	def __str__(self):
		output = "{"
		output += '"name":"{}",'.format(self.name.replace('"', '\\"'))
		output += '"country":"{}",'.format(self.country_code)
		output += '"longitude":{},'.format(self.lon)
		output += '"latitude":{}'.format(self.lat)
		output += "}"
		return output

class Tree:
	def __init__(self):
		self.children = {}
		self.elements = []

	def add_city(self, city, search_name_index=0):
		if len(city.search_name) <= search_name_index:
			self.elements.append(city)
			return
		if not (city.search_name[search_name_index] in self.children):
			self.children[city.search_name[search_name_index]] = Tree()
		self.children[city.search_name[search_name_index]].add_city(city, search_name_index+1)

	def write(self, fo):
		fo.write('{"elements": [')
		elt_written = 0
		for elt in self.elements:
			fo.write(elt.__str__())
			if elt_written < len(self.elements)-1:
				fo.write(',')
			elt_written = elt_written+1
		fo.write('], "children": {')
		elt_written=0
		for c, t in self.children.items():
			if c != '"':
				fo.write('"' + c + '": ')
			else:
				fo.write('"\\"": ')
			t.write(fo)
			if elt_written < len(self.children)-1:
				fo.write(',')
			elt_written = elt_written+1
		fo.write('}}')


cities = []
print("Reading the CSV file")
with open('geonames-all-cities-with-a-population-1000.csv', 'r') as fi:
	spamreader = csv.reader(fi, delimiter=';')
	header = spamreader.__next__()
	name_col = header.index("Name")
	ascii_name_col = header.index("ASCII Name")
	coord_col = header.index("Coordinates")
	country_code_col = header.index("Country Code")
	for row in spamreader:
		coords = row[coord_col].replace(" ", "").split(",")
		cities.append(City(
			row[name_col], row[ascii_name_col],
			float(coords[1]), float(coords[0]),
			row[country_code_col]
		))

print("Building the JSON")
name_tree = Tree()

for city in cities:
	name_tree.add_city(city)

print("Writing the JSON file")
with open('output-db.json', 'w') as fo:
	name_tree.write(fo)
