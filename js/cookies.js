export function GetCookie(cookieName) {
    cookieName += '=';

    let decodedCookie = decodeURIComponent(document.cookie);

    let cookieList = decodedCookie.split(';');

    for(let i = 0; i < cookieList.length; i++) {
        let cookie = cookieList[i];
        
        while(cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1);
        }
        
        if(cookie.indexOf(cookieName) == 0) {
            return cookie.substring(cookieName.length, cookie.length);
        }
    }

    return "";
}

export function SetCookie(cookieName, cookieValue, cookieExpire) {
    const date = new Date();
    date.setTime(date.getTime() + (cookieExpire * 86400000));
    let expires = "expires=" + date.toUTCString();
    document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
}