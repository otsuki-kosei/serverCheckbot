# serverCheckbot
# 環境構築
Node.js 環境をセットアップ。
必要なパッケージをインストール:
エラーが出るときは、node.jsのversion確認　
```shell
npm install minecraft-server-util discord.js dotenv
``` 

```shell
npx tsc --init
``` 

# 注意　トークンをそのまま使用しているため実環境に影響あり！テストサーバー立てるなど対策考えたい。だれか教えて！
# 実行
```shell
ts-node index.ts
``` 
