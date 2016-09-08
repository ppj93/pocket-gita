(function () {
    angular.module('config')
        .constant('serviceUrls', {
            getAlbums: "/getAlbums",
            addAlbum: "/addAlbum",
            editAlbum: "/editAlbum",
            deleteAlbum: "/deleteAlbum",
            getTracks: "/getTracks",
            addTrack: "/addTrack",
            editTrack: "/editTrack",
            deleteTrack: "/deleteTrack"
        });
})();