pushd src && zip -r -Z deflate -FS ../out/private-share.xpi * && popd
cp out/private-share.xpi out/private-share.crx