let currentMarker = undefined
const latlng = {
    lat: 0,
    lng: 0
}

let allMarkers = [];
let beforePoses = [];

const map = L.map('map').setView([-7.2575, 112.7521], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);  

function penanda(event) {
    if (event.originalEvent.target.classList.contains('leaflet-marker-icon')) {
        return;
    }

    batal();

    const lat = event.latlng.lat;
    const lng = event.latlng.lng;

    const marker = new L.marker([lat, lng], { draggable: true }).addTo(map);

    currentMarker = marker;

    const popupContent = `
    <div class="container mt-5">
    <form id="formTambah">
        <div class="mb-3">
            <label for="namaInput" class="form-label">Nama:</label>
            <input type="text" class="form-control" id="namaInput" name="nama">
        </div>
        <div class="mb-3">
            <label for="kategoriInput" class="form-label">Kategori:</label>
            <input type="text" class="form-control" id="kategoriInput" name="kategori">
        </div>
        <div class="mb-3">
            <label for="deskripsiInput" class="form-label">Deskripsi:</label>
            <textarea class="form-control" id="deskripsiInput" rows="3" name="deskripsi"></textarea>
        </div>
        <button type="button" class="btn btn-primary" onclick="tambah()">Tambah</button>
        <button type="button" class="btn btn-danger" onclick="batal()">Batal</button>    
    `;
    
    marker.bindPopup(popupContent).openPopup();

    // Add dragend event listener to the marker
    marker.on('dragend', function() {
        const lat = marker.getLatLng().lat;
        const lng = marker.getLatLng().lng;

        // Mengirim data menggunakan Fetch API
        fetch('update.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `id=${place.id}&nama=${place.name}&kategori=${place.ctgry}&deskripsi=${place.description}&lat=${lat}&lng=${lng}`,
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Respon jaringan buruk');
            }
            return response.text();
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Ada masalah dengan fetch :', error);
        });
    });

    // Add contextmenu event listener to the marker
    marker.on('contextmenu', function() {
        // Tampilkan modal konfirmasi
        document.getElementById('confirmModal').style.display = "block";

        // Jika pengguna mengklik 'Ya', hapus marker
        document.getElementById('confirmButton').onclick = function() {
            // Mengirim data menggunakan Fetch API
            fetch('delete.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `id=${place.id}`,
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Respon jaringan buruk');
                }
                return response.text();
            })
            .then(data => {
                console.log(data);
                map.removeLayer(marker);
            })
            .catch(error => {
                console.error('Ada masalah dengan fetch :', error);
            });

            // Sembunyikan modal
            document.getElementById('confirmModal').style.display = "none";
        };

        // Jika pengguna mengklik 'Tidak', sembunyikan modal
        document.getElementById('cancelButton').onclick = function() {
            document.getElementById('confirmModal').style.display = "none";
        };
    });
}

function tambah() {
    const nama = document.getElementById('namaInput').value;
    const kategori = document.getElementById('kategoriInput').value;
    const deskripsi = document.getElementById('deskripsiInput').value;

    const lat = currentMarker.getLatLng().lat;
    const lng = currentMarker.getLatLng().lng;

    // Mengirim data menggunakan Fetch API
    fetch('save_data.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `nama=${nama}&kategori=${kategori}&deskripsi=${deskripsi}&lat=${lat}&lng=${lng}`,
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Respon jaringan buruk');
        }
        return response.text();
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Ada masalah dengan fetch :', error);
    });

    currentMarker = undefined;
    map.closePopup();

    return false;
}


function batal() {
    if (currentMarker !== undefined) {
        map.removeLayer(currentMarker)
    }
}


map.on('click', penanda)

window.onload = function() {
    fetch('get_data.php')
    .then(response => response.json())
    .then(data => {
        data.forEach(place => {
            const marker = L.marker([place.lat, place.lng], { draggable: true }).addTo(map);
            marker.bindPopup(`<b>${place.name}</b><br>${place.description}`);

            marker.on('dragend', function() {
                const lat = marker.getLatLng().lat;
                const lng = marker.getLatLng().lng;

                // Mengirim data menggunakan Fetch API
                fetch('update.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `id=${place.id}&nama=${place.name}&kategori=${place.ctgry}&deskripsi=${place.description}&lat=${lat}&lng=${lng}`,
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Respon jaringan buruk');
                    }
                    return response.text();
                })
                .then(data => {
                    console.log(data);
                })
                .catch(error => {
                    console.error('Ada masalah dengan fetch :', error);
                });
            });

            marker.on('contextmenu', function() {
                // Tampilkan modal konfirmasi
                var myModal = new bootstrap.Modal(document.getElementById('confirmModal'), {
                    keyboard: false
                });
                myModal.show();
            
                // Jika pengguna mengklik 'Ya', hapus marker
                document.getElementById('confirmButton').onclick = function() {
                    // Mengirim data menggunakan Fetch API
                    fetch('delete.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: `id=${place.id}`,
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Respon jaringan buruk');
                        }
                        return response.text();
                    })
                    .then(data => {
                        console.log(data);
                        map.removeLayer(marker);
                    })
                    .catch(error => {
                        console.error('Ada masalah dengan fetch :', error);
                    });
            
                    // Sembunyikan modal
                    myModal.hide();
                };
            });
        });
    })
    .catch(error => console.error('Ada masalah dengan fetch:', error));
};
