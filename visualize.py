# app.py
import base64
import io
import json
import torch
import torchvision.transforms as transforms
from PIL import Image
from flask import Flask, render_template, request
from torch.nn.functional import softmax

app = Flask(__name__)
model = torch.load("mnist.pth").to('cpu')
torch.no_grad()


def pic_pred(data):
    global model
    with torch.no_grad():
        image = Image.open(io.BytesIO(data))
        r, g, b, a = image.split()
        lr = a.point(lambda i: 255 if i > 0 else 0)
        image = Image.merge('RGB', (lr, lr, lr)).convert('1')
        image = image.resize((28, 28))
        inp = transforms.Compose([transforms.ToTensor()])(image)
        predict = softmax(model(inp), dim=1)
        pred = torch.argmax(predict).item()
        probability = predict[0][pred].item()
        return pred, probability


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/image', methods=['POST'])  # 定义一个接收图片的路由，只允许POST方法
def receive_image():
    url = request.get_json()
    if url:
        data = url.replace("data:image/png;base64,", "")
        data = base64.b64decode(data)
        label, p = pic_pred(data)
        print(label, p)
        return json.dumps({'label': label, 'p': p})
    else:
        return "Image not received."


if __name__ == '__main__':
    app.run(debug=True)  # 运行flask应用
