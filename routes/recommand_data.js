var phone_key = {
    1: 'iPhone X',
    2: 'iPhone 8',
    3: 'Galaxy S8',
    4: 'Galaxy A7',
    5: 'X4+',
    6: 'A8',
    7: 'V30',
    8: 'XPERIA XZ1',
    9: 'Q6'
};

var plan_key = {
    1: 'Band 1.2G',
    2: 'Band3.2G',
    3: 'Band 어르신 1.2G',
    4: 'Band 데이터 퍼펙트',
    5: 'Band 데이터 퍼펙트S',
    6: '뉴 T끼리 맞춤형(100분+250MB)'
};

var recommand_data = {
    phone: {
        'male': {
            '10': [phone_key[3], phone_key[1], phone_key[2], phone_key[4], phone_key[7], phone_key[6], phone_key[5], phone_key[8], phone_key[9]],
            '20': [phone_key[1], phone_key[3], phone_key[2], phone_key[4], phone_key[6], phone_key[7], phone_key[5], phone_key[9], phone_key[8]],
            '30': [phone_key[1], phone_key[2], phone_key[3], phone_key[4], phone_key[6], phone_key[5], phone_key[7], phone_key[9], phone_key[8]],
            '40': [phone_key[4], phone_key[7], phone_key[5], phone_key[2], phone_key[3], phone_key[1], phone_key[6], phone_key[9], phone_key[8]],
            '50': [phone_key[6], phone_key[4], phone_key[3], phone_key[2], phone_key[5], phone_key[1], phone_key[7], phone_key[9], phone_key[8]]
        },
        'female': {
            '10': [phone_key[1], phone_key[2], phone_key[3], phone_key[4], phone_key[7], phone_key[6], phone_key[5], phone_key[8], phone_key[9]],
            '20': [phone_key[2], phone_key[3], phone_key[1], phone_key[4], phone_key[6], phone_key[7], phone_key[5], phone_key[8], phone_key[9]],
            '30': [phone_key[2], phone_key[3], phone_key[1], phone_key[4], phone_key[5], phone_key[6], phone_key[7], phone_key[9], phone_key[8]],
            '40': [phone_key[4], phone_key[7], phone_key[5], phone_key[3], phone_key[2], phone_key[1], phone_key[7], phone_key[8], phone_key[9]],
            '50': [phone_key[4], phone_key[6], phone_key[2], phone_key[3], phone_key[5], phone_key[1], phone_key[7], phone_key[8], phone_key[9]]
        }
    },
    plan: {
        'male': {
            '10': [plan_key[1], plan_key[6], plan_key[2], plan_key[4], plan_key[5], plan_key[3]],
            '20': [plan_key[4], plan_key[1], plan_key[2], plan_key[5], plan_key[6], plan_key[3]],
            '30': [plan_key[4], plan_key[1], plan_key[2], plan_key[5], plan_key[6], plan_key[3]],
            '40': [plan_key[2], plan_key[5], plan_key[4], plan_key[1], plan_key[6], plan_key[3]],
            '50': [plan_key[3], plan_key[2], plan_key[4], plan_key[5], plan_key[1], plan_key[6]]
        },
        'female': {
            '10': [plan_key[6], plan_key[1], plan_key[2], plan_key[4], plan_key[5], plan_key[6]],
            '20': [plan_key[4], plan_key[5], plan_key[1], plan_key[2], plan_key[6], plan_key[3]],
            '30': [plan_key[4], plan_key[1], plan_key[2], plan_key[5], plan_key[6], plan_key[3]],
            '40': [plan_key[5], plan_key[4], plan_key[2], plan_key[1], plan_key[6], plan_key[3]],
            '50': [plan_key[3], plan_key[2], plan_key[4], plan_key[5], plan_key[1], plan_key[6]]
        }
    }
}

module.exports = recommand_data;
