/**
 * Created by allenbklj on 8/5/15.
 */
var Imap = require('imap'),
    inspect = require('util').inspect;

var obj = {};

function connection(user,password,id){

    var imap = new Imap({
        user:user,
        password:password,
        host:'imap.gmail.com',
        port:993,
        tls:true
    });


    imap.once('ready', function() {
        console.log('Connection ready');

        openInbox(function(err, box) {

            if (err) throw err;
            getReadEmail();  //get read email and unread email
            getAttachEmail('1:'+box.messages.total,box.messages.total); //get email number with attachment and mime type

        });

    });

    imap.once('error', function(err) {

        console.log(err);
    });

    imap.once('end', function() {
        console.log('Connection ended');
    });

    imap.connect();

    function openInbox(cb){
        imap.openBox('INBOX', true, cb);
    }


    function getReadEmail(){
        imap.search(['SEEN'], function(err, results) {
            console.log('SEEN EMAIL:'+results.length);
            obj[id].seen = results.length;
            if (err) throw err;
        });
        imap.search(['UNSEEN'], function(err, results) {
            console.log('UNSEEN EMAIL:'+results.length);
            obj[id].unseen = results.length;
            if (err) throw err;
        });
    }



    function getAttachEmail(range,totalemail){
        var count = 0;
        var mime = {};
        var f = imap.seq.fetch(range, { bodies: 'TEXT',struct:true });
        f.on('message', function(msg, seqno) {
            //console.log('Message #%d', seqno);
            var attachment = 0;
            var prefix = '(#' + seqno + ') ';
            msg.on('body', function(stream, info) {
                stream.once('end', function() {
                    if (info.which !== 'TEXT')
                        console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
                    else
                        console.log(prefix + 'Body [%s] Finished', inspect(info.which));
                });
            });
            msg.once('attributes', function(attrs) {

                function checkStruct(ele){
                    if(Array.isArray(ele)){
                        ele.forEach(checkStruct);
                    }else{
                        if(ele.disposition !== null && ele.disposition.type.toLowerCase() === 'attachment'){
                            attachment++;
                            if(mime.hasOwnProperty(ele.subtype)){
                                console.log('hasproperty');
                                mime[ele.subtype] += 1;
                            }else{
                                console.log('new propperty');
                                Object.defineProperty(mime,ele.subtype,{writable:true,enumerable:true,configurable:true,value:1});
                            }
                        }
                    }
                }

                var struct = attrs.struct;
                checkStruct(struct);
                if(attachment > 0){
                    console.log(prefix + ' has '+attachment +' attachment');
                    count++
                }

            });

            msg.once('end', function() {
                console.log(prefix + 'Finished');

            });
        });
        f.once('error', function(err) {
            console.log('Fetch error: ' + err);
        });
        f.once('end', function() {
            console.log('Done fetching all messages!');
            console.log('Emails with attachment:'+count);
            console.log('Emails without attachment:'+(totalemail-count));
            console.log(mime);
            obj[id].attach = count;
            obj[id].unattach = totalemail - count;
            obj[id].mime = mime;
            obj[id].status = 'complete';
            imap.end();
        });
    }

}

exports.getConnect = connection;
exports.obj = obj;
