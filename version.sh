PACKAGE_VERSION=$(grep '"version":' package.json | cut -d\" -f4)
echo $PACKAGE_VERSION