$(document).ready(function () {
    $.get("https://api.apify.com/v2/key-value-stores/ZsOpZgeg7dFS1rgfM/records/LATEST", function (data, status) {
        $('.confirmed .number').text(data.infected);
        $('.deaths .number').text(data.deceased);
        $('.recoverd .number').text(data.recovered);
        var date = new Date(data.lastUpdatedAtSource);
        var data_formated = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
        $('.time_text').text(data_formated);
        $.get("https://api.apify.com/v2/key-value-stores/p3nS2Q9TUn6kUOriJ/records/LATEST", function (dataCity, status) {

            cities = dataCity.key
            let listByCity = data.detail
            listByCity = listByCity.sort()
            inner_html()
            gen_data(data.detail)
            $(".search").click(function () {
                console.log($(".textSearch").val())
                const strSearch = $(".textSearch").val().toLowerCase()
                var index = search(strSearch.normalize("NFD").replace(/[\u0300-\u036f]/g, ""), data.detail);
                inner_html()
                console.log(index)
                console.log(data.detail)
                append_html(data.detail[index])
            });
        })
    });

    $.get("https://api.quarantine.country/api/v1/spots/week?region=vietnam", function (data, status) {
        console.log(data)
        for (const property in data.data) {
            console.log(`${property}: ${data.data[property]}`);
            $('.container2 table').append(`
                <tr>
                    <td>${property}</td>
                    <td>${data.data[property].total_cases}</td>
                    <td>${data.data[property].recovered}</td>
                    <td>${data.data[property].critical}</td>
                    <td>${data.data[property].deaths}</td>
                    <td>${data.data[property].tested}</td>
                    <td>${data.data[property].death_ratio}</td>
                    <td>${data.data[property].recovery_ratio}</td>
                </tr>
            `);
        }

    })
});

gen_data = (data) => {
    data.forEach((element, index) => {
        element.city = cities.find(x => x['hec-key'] === element['hc-key'])?.name;
        append_html(element)
    })
}


inner_html = () => {
    $('.container table').html(`
        <tr>
            <th>Tỉnh thành</th>
            <th>Số ca khỏi</th>
            <th>Sô ca đang điều trị</th>
            <th>Sô ca tử vong</th>
            <th>Tổng số ca</th>
        </tr>
    `);
}
append_html = (element) => {
    $('.container table').append(`
        <tr>
            <td>`+ element?.city + `</td>
            <td>`+ element.socakhoi + `</td>
            <td>`+ element.socadangdieutri + `</td>
            <td>`+ element.socatuvong + `</td>
            <td>`+ element.value + `</td>
        </tr>
    `);
}

search = (nameKey, myArray) => {
    let temp_array = myArray
    temp_array.forEach((e, i) => {
        e.city = e?.city?.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    })
    console.log(temp_array)
    console.log(nameKey)
    for (var i = 0; i < temp_array.length; i++) {
        if (temp_array[i].city.includes(nameKey)) {
            return i;
        }
    }
}