echo && echo "[0] cleaning www..."
rm -rf ./www
mkdir www

echo && echo "[1] copying PHP scripts to www..."
cp -r ./src/* ./www

echo && echo "[2] building ClientApp..."
cd ../ClientApp
npm run build 
cd ../PhpApp

echo && echo "[3] copying ClientApp to www..."
cp -r ../ClientApp/dist/* ./www

echo && echo -e "Done. Now you have to \033[0;93mdocker-compose up\033[0m !"
