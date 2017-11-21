
// cdlist key: 1TbS7XG-SYaCJozVz2EtQkWbUHez6IRCJB23ZhLphgBM
const cdURI = "https://spreadsheets.google.com/feeds/list/1TbS7XG-SYaCJozVz2EtQkWbUHez6IRCJB23ZhLphgBM/1/public/values?alt=json";

// respose field format
// ["0"].gsx$artist.$t

// fetch CD  data from google spreadsheet

let cdData = [];

axios.get(cdURI)
    .then(function (response) {
        const items = response.data;
    // console.log(response);
    // console.log(items.feed.entry);
    for (item of items.feed.entry) {
        let artist = item.gsx$artist.$t;
        let album = item.gsx$title.$t;
        let genre = item.gsx$genre.$t; // todo: make Cap case
        let number = item.gsx$number.$t;
        let amount = item.gsx$amount.$t;
        let visible = items.gsx$visible.$t;
        console.log(visible);

        thisgift = { album: album, artist: artist, genre: genre, number: number, donation: amount};

        if (number != "0" && visible != "0") {
            cdData.push(thisgift);
        }
        }
    })
    .catch(function (error) {
        console.log(error);
        cdData.push({ title: "Whoops!", description: "Could not load CD list", genre: ""})
    });

// table component
Vue.component('demo-grid', {
    template: '#grid-template',
    props: {
        data: Array,
        columns: Array,
        filterKey: String
    },
    data: function () {
        var sortOrders = {}
        this.columns.forEach(function (key) {
            sortOrders[key] = 1
        })
        return {
            sortKey: '',
            sortOrders: sortOrders
        }
    },
    computed: {
        filteredData: function () {
            var sortKey = this.sortKey
            var filterKey = this.filterKey && this.filterKey.toLowerCase()
            var order = this.sortOrders[sortKey] || 1
            var data = this.data
            if (filterKey) {
                data = data.filter(function (row) {
                    return Object.keys(row).some(function (key) {
                        return String(row[key]).toLowerCase().indexOf(filterKey) > -1
                    })
                })
            }
            if (sortKey) {
                data = data.slice().sort(function (a, b) {
                    a = a[sortKey]
                    b = b[sortKey]
                    return (a === b ? 0 : b > a ? 1 : -1) * order
                })
            }
            return data
        }
    },
    filters: {
        capitalize: function (str) {
            return str.charAt(0).toUpperCase() + str.slice(1)
        }
    },
    methods: {
        sortBy: function (key) {
            this.sortKey = key
            this.sortOrders[key] = this.sortOrders[key] * -1
        }
    }
})

// bootstrap the demo
var app = new Vue({
    el: '#cd-list',
    data: {
        searchQuery: '',
        gridColumns: ['album', 'artist', 'genre', 'donation'],
        gridData: cdData
    }
})

