rm -rvf /run/user/1000/gvfs/dav:host=webdav.cloudbeeline.ru,ssl=true/razum-common
mkdir /run/user/1000/gvfs/dav:host=webdav.cloudbeeline.ru,ssl=true/razum-common
zip -r dist/dist.zip dist
cp dist/dist.zip /run/user/1000/gvfs/dav:host=webdav.cloudbeeline.ru,ssl=true/razum-common/dist.zip
