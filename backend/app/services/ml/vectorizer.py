import torch
from transformers import AutoTokenizer, AutoModel

# tokenizer = AutoTokenizer.from_pretrained("ai-forever/sbert_large_nlu_ru")
# sbert = AutoModel.from_pretrained("ai-forever/sbert_large_nlu_ru")

# device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
# sbert = sbert.to(device)
# sbert = sbert.eval()


def mean_pooling(model_output, attention_mask):
    token_embeddings = model_output[
        0
    ]  # First element of model_output contains all token embeddings
    input_mask_expanded = (
        attention_mask.unsqueeze(-1).expand(token_embeddings.size()).float()
    )
    sum_embeddings = torch.sum(token_embeddings * input_mask_expanded, 1)
    sum_mask = torch.clamp(input_mask_expanded.sum(1), min=1e-9)
    return sum_embeddings / sum_mask


def vectorize(tokenizer, sbert, text: str) -> torch.Tensor:
    encoded_input = tokenizer(
        text, padding=True, truncation=True, max_length=24, return_tensors="pt"
    )
    with torch.no_grad():
        model_output = sbert(**encoded_input)
    sentence_embeddings = mean_pooling(model_output, encoded_input["attention_mask"])

    return sentence_embeddings.tolist()[0]
