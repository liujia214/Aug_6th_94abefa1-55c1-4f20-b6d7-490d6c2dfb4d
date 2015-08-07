/**
 * Created by allenbklj on 8/6/15.
 */
function ajax(verb,url,data){

    return new Promise(function(resolve,reject){

        var xhr = new XMLHttpRequest();
        xhr.open(verb,url);
        xhr.setRequestHeader('Content-Type','application/json')
        xhr.addEventListener('readystatechange',function(){
            if(xhr.readyState ===4){
                console.log('response success.....');
                resolve(xhr.responseText);
            }
        });
        xhr.send(JSON.stringify(data));

    })
}