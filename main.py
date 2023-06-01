import torch
import torchvision
import torchvision.transforms as transforms
from model import CNN

batch_size = 64
num_epochs = 15
learning_rate = 0.005

if torch.cuda.is_available():
    device = torch.device("cuda")
else:
    device = torch.device("cpu")

transform = transforms.Compose([transforms.ToTensor(), transforms.Normalize((0.5,), (0.5,))])
trainset = torchvision.datasets.MNIST(root='./data', train=True, download=True, transform=transform)  # 加载训练集
trainloader = torch.utils.data.DataLoader(trainset, batch_size=batch_size, shuffle=True, num_workers=2)  # 定义训练集加载器
testset = torchvision.datasets.MNIST(root='./data', train=False, download=True, transform=transform)  # 加载测试集
testloader = torch.utils.data.DataLoader(testset, batch_size=batch_size, shuffle=False, num_workers=2)  # 定义测试集加载器

if __name__ == '__main__':
    model = CNN().to(device)
    criterion = torch.nn.CrossEntropyLoss()  # 使用交叉熵损失函数
    optimizer = torch.optim.Adam(model.parameters(), lr=learning_rate, weight_decay=0.0005)  # 使用随机梯度下降优化器

    # 训练模型
    for epoch in range(num_epochs):
        running_loss = 0.0
        for i, data in enumerate(trainloader):
            inputs, labels = data
            inputs = inputs.to(device)
            labels = labels.to(device)
            optimizer.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs, labels)  # 计算损失值
            loss.backward()  # 反向传播计算梯度
            optimizer.step()  # 更新参数
            running_loss += loss.item()  # 累加损失值
            if i % 200 == 199:
                print('[%d, %5d] loss: %.8f' % (epoch + 1, i + 1, running_loss / (i + 1)))
            running_loss = 0.0
    print('Finished Training')

    correct = 0
    total = 0
    with torch.no_grad():
        for data in testloader:
            images, labels = data
            images = images.to(device)
            labels = labels.to(device)
            outputs = model(images)
            _, predicted = torch.max(outputs.data, 1)
            total += labels.size(0)
            correct += (predicted == labels).sum().item()
    print('Accuracy of the network on the 10000 test images: %d %%' % (100 * correct / total))
    torch.save(model, 'mnist.pth')
