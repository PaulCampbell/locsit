
function home(req,res) {
    console.log('home')
    res.render('index', {
      title: 'Realtime Twitter Hashmaps'
    });
}

function map(req,res) {
    var tag = req.params.hashtag;
    console.log('map')

    res.render('map', {
      title: '#' + tag +  ': Realtime Twitter Hashmaps'
    });
}

exports.home = home;
exports.hashmap = map;