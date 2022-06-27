
import sys
import json
import os
import re


source_path = os.path.dirname(os.path.realpath(__file__))
song_format = 'WAV，FLAC，APE，ALAC，WavPack(WV),MP3，AAC，Ogg Vorbis，Opus'
lrc_format = 'lrc,ini,txt'
print(source_path)

song_format_list = re.split(r'[^a-zA-Z0-9]', song_format)
song_format_list = list(map(lambda str: '.'+str.lower(), song_format_list))
lrc_format_list = re.split(r'[^a-zA-Z0-9]', lrc_format)
lrc_format_list = list(map(lambda str: '.'+str.lower(), lrc_format_list))
print(song_format_list)


musics = {}
songs = []

for filepath, dirnames, filenames in os.walk(source_path):
    for filename in filenames:
        last_name = os.path.splitext(filename)[-1]
        file_name = os.path.splitext(filename)[0]
        if(last_name in song_format_list):
            if(file_name not in musics):
                musics[file_name] = {}
            musics[file_name]['song'] = filename
            songs.append(os.path.join('..', os.path.relpath(
                filepath, os.path.relpath(source_path, source_path)), filename))
        if(last_name in lrc_format_list):
            if(file_name not in musics):
                musics[file_name] = {}
            musics[file_name]['lrc'] = filename

        # print(file_name, last_name)
        # print(source_path, filename, last_name, last_name in song_format_list)


remove_from_dist = []
for item in musics:
    if(not 'lrc' in musics[item]):
        remove_from_dist.append(item)


for item in remove_from_dist:
    musics.pop(item)


print(json.dumps(musics, sort_keys=True, indent=4, separators=(',', ': ')))
print(musics)


musics_json_path = (os.path.join(source_path, 'musics.json'))
songs_json_path = (os.path.join(source_path, 'songs.json'))
with open(musics_json_path, 'w') as f:
    json.dump(musics, f,
              indent=2,
              sort_keys=True,
              ensure_ascii=False)


with open(songs_json_path, 'w') as f:
    json.dump(songs, f,
              indent=2,
              sort_keys=True,
              ensure_ascii=False)
