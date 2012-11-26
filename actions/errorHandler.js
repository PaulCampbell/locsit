
function handle(err, httpCode, res)
{
    console.log(err);
    if(httpCode)
        res.send(httpCode, err);
}

exports.handle = handle;