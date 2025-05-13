read -sp "Enter key:" key
echo
read -sp "Enter secret:" secret
echo

WEB_EXT_API_KEY="$key" WEB_EXT_API_SECRET="$secret" npx web-ext sign -s src/ -a out --channel unlisted
