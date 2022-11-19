paths = ['Potion.json', 'Monster.json', 'TargetBuff.json', 'Tower.json', 'TowerBuff.json', ]
concepts = ['potion', 'monster', 'targetBuff', 'tower', 'towerBuff']
import json

index = {}
for path, concept in zip(paths, concepts):
    js = json.load(open(path))
    print(js)
    for k in js[concept]:
        instance = k
        if not (concept == 'monster' and (
                js[concept][instance]['category'] == "boss" or js[concept][instance]['category'] == "minion")):
            _type = len(index)
            index[_type] = {
                'concept': concept,
                'instance': k}
with open('CardTypeMap.json', 'w+') as f:
    json.dump(index, f, indent=2)
