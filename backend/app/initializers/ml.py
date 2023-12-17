import typing as tp
from transformers import (
    AutoTokenizer,
    AutoModel,
    PreTrainedTokenizer,
    PreTrainedTokenizerFast,
)

import torch

model = "cointegrated/rubert-tiny2"  # "ai-forever/sbert_large_nlu_ru"
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
tokenizer: PreTrainedTokenizer | PreTrainedTokenizerFast = (
    AutoTokenizer.from_pretrained(model)
)
# 'cointegrated/rubert-tiny2'
sbert: tp.Any = AutoModel.from_pretrained(model)
sbert = sbert.to(device)
sbert = sbert.eval()
