import os
import sys
import json
import zipfile
from huggingface import pipeline

iexec_in = os.environ['IEXEC_IN']

iexec_out = os.environ['IEXEC_OUT']

prompt = "Hello, World! Hello,"

try:
    with zipfile.ZipFile(iexec_in + "/protectedData.zip") as input_zip:
        with input_zip.open("email") as prompt_f:
            prompt = prompt_f.read().decode('utf-8')
except e:
    pass

generator = pipeline(task='text-generation', model='gpt2')

output = generator(prompt, num_return_sequences=1)

# Append some results in /iexec_out/
with open(iexec_out + '/result.txt', 'w+') as fout:
    fout.write(output)

# Declare everything is computed
with open(iexec_out + '/computed.json', 'w+') as f:
    json.dump({ "deterministic-output-path" : iexec_out + '/result.txt' }, f)
