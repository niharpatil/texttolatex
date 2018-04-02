import json
import sklearn
import numpy as np
from sklearn.cluster import KMeans
from itertools import groupby
import sys

from parse import ParseObject

input_json_path = sys.argv[1]
num_clusters = int(sys.argv[2])
output_filename = sys.argv[3]
print(input_json_path)
print(num_clusters)
print(output_filename)
sys.stdout.flush()

with open(input_json_path, 'r') as f:
  data = json.load(f)
  datastore = data['processed']
  title = data['title']
  author = data['author']
  pre_pref_map = data['preference_mapping']

# Process the preference_mapping
preference_mapping = {}
for obj in pre_pref_map:
  preference_mapping[obj['keyword']] = obj['mapping'][0]


Yvalues = list(map(lambda x: x['topLeft']['y'],datastore))
Xvalues = list(map(lambda x: x['topLeft']['x'], datastore))
words = list(map(lambda x: x['word'], datastore))
npY = np.array(Yvalues).reshape(-1,1)

def get_opt_num_clusters(Yvalues, p):
  srt = sorted(Yvalues)
  diffs = []
  for i in range(len(srt)-1):
    diffs.append(srt[i+1] - srt[i])
  num_clusters = 1
  for i in range(len(diffs) - 1):
    if(diffs[i+1] > p*diffs[i]):
      num_clusters = num_clusters + 1
  if(diffs[0] > p*min(diffs)):
    num_clusters = num_clusters + 1
  return num_clusters
    
print(get_opt_num_clusters(Yvalues, 4))


model = KMeans(n_clusters=num_clusters)
model.fit(npY)

clustered = sorted(list(zip(Xvalues, Yvalues, model.fit_predict(npY), words)), key=lambda tup: tup[2])

grouped_clusters = []
for key, group in groupby(clustered, lambda x: x[2]):
  group = list(group)
  sorted_group = sorted(group, key=lambda x: x[0])
  grouped_clusters.append((sum(list(map(lambda x: x[1],group)))/len(group),sorted_group))
  
sorted_grouped_clusters = sorted(grouped_clusters, key=lambda x: x[0])
final_clusters = list(map(lambda x: x[1],sorted_grouped_clusters))

text = []
for lst in final_clusters:
  for (x,y,c,wrd) in lst:
    text.append(wrd)

# Here we have text, author, and title



parser = ParseObject(preference_mapping, title, author)

parser.gen_latex(text, output_filename)