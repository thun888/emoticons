# 转换Artalk为OWO 
# 只转换单个的
def artalk_to_owo(artalk_data):
    owo_data = {}
    item_data = {}
    name = artalk_data["name"]
    items = artalk_data["items"]
    type = artalk_data["type"]
    container = []
    for item in items:
        text = item['key']
        if type == "image":
            icon = f"<img src='{item['val']}'>"
        else:
            icon = item['val']
        emoticon = {} 
        emoticon["text"] = text
        emoticon["icon"] = icon
        container.append(emoticon)

    item_data["type"] = type
    item_data["container"] = container

    owo_data[name] = item_data
    return owo_data

