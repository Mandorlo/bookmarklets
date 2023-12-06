window.fillForm = async () => {

    window.loadStyle = async (url) => {
        if (Array.isArray(url)) return Promise.all(url.map(window.loadStyle));
        if (/\.js$/gi.test(url)) return window.loadScript(url);
        if (document.querySelector(`link[href="${url}"]`)) return;
        let link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        document.head.appendChild(link);
        console.log('loading', url, '...');
        await new Promise(resolve => link.addEventListener('load', resolve));
        console.log(url, 'loaded');
        return true;
    };
    
    window.loadScript = async (url) => {
        if (Array.isArray(url)) return Promise.all(url.map(window.loadScript));
        if (/\.css$/gi.test(url)) return window.loadStyle(url);
        if (document.querySelector(`script[src="${url}"]`)) return;
        let script = document.createElement('script');
        script.src = url;
        document.head.appendChild(script);
        console.log('loading', url, '...');
        await new Promise(resolve => script.addEventListener('load', resolve));
        console.log(url, 'loaded');
        return true;
    };

    /* add jQuery if it's not already loaded */
    if (!window.jQuery || !window.Noty) await window.loadScript([
        'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/noty/3.1.4/noty.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/noty/3.1.4/noty.min.css',
    ]);
    let $ = window.jQuery;

    window.getLabel = (input) => {
        let label = $(input).closest('label');
        if (label.length) return label.test().trim();
        let id = $(input).attr('id');
        if (id) return $(`label[for="${id}"]`);
        label = $(input).parent().find('label');
        if (label.length) return label.test().trim();
        label = $(input).parent().parent().find('label');
        if (label.length) return label.test().trim();
        return input.text().trim() || input.parent().text().trim();
    };

    window.getRadioOptions = (input) => {
        let options = [];
        if ($(input).attr('name')) options = $(input).closest('form').find(`input[name="${$(input).attr('name')}"]`);
        else {
            let parent = $(input).parent();
            while (parent.find('input[type="radio"]').length == 1) parent = parent.parent();
            options = parent.find('input[type="radio"]');
        }
        options = Array.from(options).map(el => ({el, value: el.value, label: window.getLabel(el)}));
        console.log('radio options', input, options);
        return options;
    };

    window.pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

    if (!window.cities?.length) window.cities = await fetch('https://gist.githubusercontent.com/curran/13d30e855d48cdd6f22acdf0afe27286/raw/0635f14817ec634833bb904a47594cc2f5f9dbf8/worldcities_clean.csv').then(r => r.text()).then(t => {
        let lines = t.split('\n');
        let cities = [];
        lines.forEach((line, i) => {
            if (!i) return;
            let values = line.split(',');
            cities.push({
                city: values[0],
                lat: values[1],
                lng: values[2],
                country: values[3],
            });
        });
        return cities;
    });

    window.fillForm = (target) => {
        let form = $(target).closest('form');
        if (!form.length) return alert('No form found');

        /* fill inputs */
        let inputs = form.find('input[type="text"], input[type="email"], input[type="tel"], input[type="number"], input[type="password"]');
        let firstnames = ['Carlo', 'Enrica', 'Giovanni', 'Giuseppe', 'Maria', 'Mario', 'Paolo', 'Pietro', 'Roberto', 'Sara', 'Silvia', 'Simone', 'Stefano'];
        let lastnames = ['Bianchi', 'Bruno', 'Colombo', 'Conti', 'Costa', 'De Luca', 'Ferrari', 'Fontana', 'Galluccio', 'Musk', 'Baugé', 'Dumont', 'Genbrugge', 'Lefebvre', 'Leroy', 'Petit', 'Robert', 'Simon', 'Thomas', 'Vasseur', 'Wagner', 'Weber', 'Werner', 'Zimmermann', 'Berg', 'Bakker', 'Jansen', 'Visser', 'Smit', 'Meijer', 'De Jong', 'De Vries', 'Van de Berg', 'Van den Berg', 'Van der Berg', 'Van Dijk', 'Bakker', 'Janssen', 'Visser', 'Smit', 'Meijer', 'De Boer', 'Mulder', 'De Groot', 'Bos', 'Vos', 'Peters', 'Hendriks', 'Van Leeuwen', 'Dekker', 'Brouwer', 'De Wit', 'Dijkstra', 'Smits', 'De Graaf', 'Van der Meer', 'Van der Linden', 'Kok', 'Jacobs', 'Vermeulen', 'Van Vliet', 'Van den Heuvel', 'Van der Veen', 'Van den Broek', 'De Bruin', 'Schouten', 'Van Beek', 'Van Dam', 'Van den Brink', 'Koster', 'Van der Wal', 'Maas', 'Verhoeven', 'Kuijpers', 'Van der Heijden', 'Scholten', 'Van Wijk', 'Post', 'Martens', 'Vink', 'Prins', 'Sanders', 'Van de Ven', 'Verschoor', 'Kuiper', 'Van der Heide', 'Van den Bosch', 'Van der Meulen', 'Kramer', 'Van der Laan', 'Van der Velde', 'Van Doorn', 'Van de Pol', 'Schmidt', 'Timmermans', 'Jonker', 'Van den Berg', 'Van der Linden', 'Kramer', 'Van der Laan', 'Van der Velde', 'Van Doorn', 'Van de Pol', 'Schmidt', 'Timmermans', 'Jonker', 'Van den Broek', 'Van der Heide', 'Van den Bosch', 'Van der Meulen', 'Van der Velden', 'Kuijpers', 'Van der Horst', 'Van der Heijden', 'Scholten', 'Van Wijk', 'Post', 'Martens', 'Vink', 'Prins', 'Sanders', 'Van de Ven', 'Verschoor', 'Kuiper', 'Van der Heide', 'Van den Bosch'];
        let email_domains = ['@gmail.com', '@hotmail.com', '@yahoo.com', '@outlook.com', '@protonmail.com', '@tutanota.com', '@aol.com', '@mail.com', '@gmx.com', '@zoho.com', '@yandex.com', '@icloud.com', '@live.com', '@inbox.com'];
        let names = ['dolphin', 'eagle', 'elephant', 'fox', 'giraffe', 'gorilla', 'horse', 'lion', 'monkey', 'panda', 'parrot', 'penguin', 'pig', 'rabbit', 'snake', 'tiger', 'turtle', 'wolf', 'zebra'];
        let adjectives = ['adorable', 'beautiful', 'clean', 'drab', 'elegant', 'fancy', 'glamorous', 'handsome', 'long', 'magnificent', 'old-fashioned', 'plain', 'quaint', 'sparkling', 'ugliest', 'unsightly', 'angry', 'bewildered', 'clumsy', 'defeated', 'embarrassed', 'fierce', 'grumpy', 'helpless', 'itchy', 'jealous', 'lazy', 'mysterious', 'nervous', 'obnoxious', 'panicky', 'repulsive', 'scary', 'thoughtless', 'uptight', 'worried'];
        
        let last_firstname = '';
        let last_lastname = '';
        let last_city = window.pickRandom(window.cities);
        let gen_code_postal_fr = () => {
            let code_postal = '';
            let departement = Math.floor(Math.random() * 96) + 1;
            if (departement < 10) departement = '0' + departement;
            code_postal += departement;
            let commune = Math.floor(Math.random() * 999) + 1;
            if (commune < 10) commune = '00' + commune;
            else if (commune < 100) commune = '0' + commune;
            code_postal += commune;
            return code_postal;
        };

        inputs.each((i, el) => {
            /* skip inputs with a value */
            if ($(el).val()) return;
            /* get the input type */
            let type = $(el).attr('type');
            if (type == 'text') {
                /* get label */
                let label = window.getLabel(el);
                if (!label) return console.warn('No label found for', el);
                let text = label.text().trim();
                if (/^(pr[eé]nom|first)/gi.test(text)) {
                    last_firstname = window.pickRandom(firstnames);
                    el.value = last_firstname;
                } else if (/^(nom|last|name)/gi.test(text)) {
                    last_lastname = window.pickRandom(lastnames);
                    el.value = last_lastname;
                } else if (/^(zip|postal|code.?postal)/gi.test(text)) {
                    el.value = gen_code_postal_fr();
                } else if (/^(city|ville)/gi.test(text)) {
                    el.value = last_city.city;
                } else {
                    el.value = 'test '+Math.random().toString(36).substring(7);
                }
            } else if (type == 'email') {
                let s = window.pickRandom(names) + '.' + window.pickRandom(adjectives);
                if (last_firstname) {
                    s = last_firstname;
                    if (last_lastname) s += '.' + last_lastname;
                } else if (last_lastname) {
                    s = last_lastname;
                }
                el.value = s.toLowerCase() + window.pickRandom(email_domains);
            } else if (type == 'radio') {
                /* get all the options */
                let options = window.getRadioOptions(el);
                /* pick a random option */
                let option = window.pickRandom(options);
                /* check the option */
                $(option.el).click();
            } else if (type == 'date') {
                let min_date = el.min;
                let max_date = el.max;  
                if (!min_date) min_date = '1970-01-01';
                if (!max_date) max_date = '2030-01-01';
                let date = new Date(min_date.getTime() + Math.random() * (max_date.getTime() - min_date.getTime()));
                el.value = date.toISOString().split('T')[0];
            } else if (type == 'phone') {
                el.value = '06'+Math.floor(Math.random() * 89999999 + 10000000);
            } else {
                console.warn('input type not yet supported', type, el);
            }
        });

        /* fill selects */
        let selects = form.find('select');
        selects.each((i, el) => {
            /* skip selects with a value */
            if ($(el).val()) return;
            /* if it's a country list */
            if (last_city.country) {
                let text = window.getLabel(el);
                if (/^(country|pays)/gi.test(text)) {
                    let country = last_city.country.toLowerCase();
                    for (let opt of Array.from($(el).find('option'))) {
                        if (opt.value.toLowerCase() != country && opt.label.toLowerCase() != country) continue;
                        return $(opt).prop('selected', true);
                    }
                }
            }
            /* get a random option */
            let option = window.pickRandom(Array.from($(el).find('option')));
            /* select the option */
            $(option).prop('selected', true);
        });

    };

    document.addEventListener('click', (e) => {
        if (!/^(input|select|label)$/gi.test(e.target.tagName)) return;
        window.fillForm(e.target);
    });
    new Noty({text: 'Click on a form field to fill the form', type: 'info', timeout: 3000}).show();

};
window.fillForm();