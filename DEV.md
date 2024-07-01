# URL
http://localhost:5173/#/player?user=...&password=...

# SVG
import CloseBtn from '../../assets/btn/close-square-line-icon.svg';
<SvgIcon component="object">
    <embed
        type="image/svg+xml"
        src={CloseBtn}
        style={{ height: '100%', display: 'flex', fontSize: '1.4rem' }}
    />
</SvgIcon>

# MUI CSS
background-color: th => fade(black, th.palette.action.hoverOpacity)

### alpha
https://mui.com/material-ui/api/fade/#import
backgroundColor: (th) => alpha(th.palette.primary.main, th.palette.action.selectedOpacity),

# Free Icons
https://uxwing.com/
https://icomoon.io/app/#/select

# scripts
clear; git pull; ./build-deploy.sh && ./deploy-pi.sh
clear; sudo rsync -hikLmrt Downloads/audio-ui/ /var/www/html/audio-ui/

# remote dev env
OPENSSL_CONF=./openssl.cnf npm i
OPENSSL_CONF=./openssl.cnf npm run dev-from-remote

# backup
rmv audio-ui.tgz
tar --exclude=.git --exclude=dist --exclude=node_modules --exclude=audio-ui.tgz -czf audio-ui.tgz audio-ui
tar -tzf audio-ui.tgz
cd audio-ui
