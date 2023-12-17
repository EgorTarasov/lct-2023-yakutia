import torch
from transformers import AutoTokenizer, AutoModel
from typing import List
import re

tokenizer = AutoTokenizer.from_pretrained("cointegrated/rubert-tiny2")
sbert = AutoModel.from_pretrained("cointegrated/rubert-tiny2")

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
sbert = sbert.to(device)
sbert = sbert.eval()

emoji_pattern = re.compile('[\U00010000-\U0010ffff]', flags=re.UNICODE)

def clean(x):
    x = re.sub("<br>", ' ', x)
    x = re.sub("\n", ' ', x)
    x = emoji_pattern.sub('', x)
    x = re.sub(r'[abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ]', r' ', x)
    x = re.sub(r'(http\S+)|(www\S+)|([\w\d]+www\S+)|([\w\d]+http\S+)', r' ', x)
    return x


def mean_pooling(model_output, attention_mask):
    token_embeddings = model_output[0] #First element of model_output contains all token embeddings
    input_mask_expanded = attention_mask.unsqueeze(-1).expand(token_embeddings.size()).float()
    sum_embeddings = torch.sum(token_embeddings * input_mask_expanded, 1)
    sum_mask = torch.clamp(input_mask_expanded.sum(1), min=1e-9)
    return sum_embeddings / sum_mask


def vectorize(text: str) -> List[float]:
    text = clean(text)
    encoded_input = tokenizer(text, padding=True, truncation=True, max_length=256, return_tensors='pt')
    with torch.no_grad():
        model_output = sbert(**encoded_input)
    sentence_embeddings = mean_pooling(model_output, encoded_input['attention_mask'])

    return sentence_embeddings.tolist()[0]
