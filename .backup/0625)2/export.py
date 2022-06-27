import sys
import json
import os
import re

items = []

with open('./settings.json', 'r', encoding='utf8')as fp:
    json_data = json.load(fp)
    del json_data['backup']
    print(json_data)
    if 'default' in json_data:
        items.append('default')
    for item in json_data['previews']:
        items.append(item)
        print(item)
    for item in json_data['export_auto_copy']:
        items.append(item)
        print(item)
print(items)

source_path = r'.'
target_path = '../p5js_Archives'
target_path2 = './.export'

if(os.path.exists(target_path) == False):
    target_path = target_path2


par_path = os.path.pardir
# print(par_path, target_path, os.path.abspath(target_path))
# print(os.path.abspath(os.path.join(target_path, par_path)))
# for filepath, dirnames, filenames in os.walk(par_path,topdown=False):
#     print(filepath, dirnames, filenames)

# for fpath, dnames, fnames in os.walk(par_path):
#     print(fpath, dnames, fnames)
# if(len(filenames)!=0):

copy_command = ''

print(sys.platform)
if sys.platform.startswith('win32'):
    copy_command = 'copy'
elif sys.platform.startswith('darwin'):
    copy_command = 'cp'


for item in items:
    item_path = os.path.join(source_path, item)
    print('item path : ', item_path)
    for filepath, dirnames, filenames in os.walk(item_path):
        for filename in filenames:
            source_file_path = os.path.join(filepath, filename)
            if(re.compile(r'(/\.)|(backup)').search(source_file_path) == None):
                target_file_path = re.compile(
                    '^\.').sub(target_path, source_file_path)

                s_path = os.path.abspath(source_file_path)
                t_path = os.path.abspath(target_file_path)
                # print(source_file_path, ' => ', target_file_path)
                # print(s_path, '=>', t_path)
                # print(os.path.dirname(t_path))
                # print(os.path.exists(os.path.dirname(t_path)))

                if not os.path.exists(os.path.dirname(t_path)):
                    os.makedirs(os.path.dirname(t_path))
                this_copy_command = copy_command+' "'+s_path+'" "'+t_path+'"'
                print(this_copy_command)
                os.system(this_copy_command)


for f in os.listdir(source_path):
    if(re.compile(r'(/\.)|(backup)').search(f) == None and os.path.isdir(f) == False):
        source_file_path = os.path.join(source_path, f)
        if(re.compile(r'(/\.)|(backup)').search(source_file_path) == None):
            target_file_path = re.compile('^\.').sub(
                target_path, source_file_path)
            s_path = os.path.abspath(source_file_path)
            t_path = os.path.abspath(target_file_path)
            this_copy_command = copy_command+' "'+s_path+'" "'+t_path+'"'
            print(this_copy_command)
            os.system(this_copy_command)
