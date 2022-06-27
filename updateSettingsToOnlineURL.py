import sys
import json
import os
import re

source_path = os.path.abspath(os.path.join(os.path.abspath(__file__), '..'))
target_path = os.path.abspath(os.path.join(source_path, '../p5js_Archives'))
target_path2 = os.path.abspath(os.path.join(source_path, '.export'))

export_json_files = ['.settings.json', ]


for file in export_json_files:
    file_path = os.path.abspath(os.path.join(source_path, file))
    subfile = re.sub(re.compile(r'^\.'), '', file)
    subfile_path = os.path.abspath(os.path.join(source_path, subfile))

    print(file_path, subfile_path)
    
    with open(file_path, 'r', encoding='utf8')as fp:
        json_data = json.load(fp)
        json_text = json.dumps(json_data, indent=2)
        videoRegex = re.compile(
            r'("(previewVideo)"(.*\/([^/]+\.(([mM][pP]4)|([wW][eE][bB][mM]))).*))')
        imageRegex = re.compile(
            r'("(previewImg)"(.*\/([^/]+\.(([jJ][pP][gG])|([gG][iI][fF])|([pP][nN][gG]))).*))')
        new_json_text = re.sub(
            videoRegex, r'"_\2"\3\n "\2": "https://media.leizingyiu.net/video/\4",', json_text)
        new_json_text = re.sub(
            imageRegex, r'"_\2"\3\n "\2": "https://pic.leizingyiu.net/p5_leizingyiu_net/\4",', new_json_text)
        new_json = json.loads(new_json_text)
        with open(subfile_path, 'w') as f:
            json.dump(new_json, f,
                      indent=2,
                      sort_keys=False,
                      ensure_ascii=False)
