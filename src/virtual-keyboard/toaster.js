import './css/toaster.css';

// функция-конструктор Toast (для создания объектов Toast)
export const Toast = function (element, config) {
  // приватные переменные класса Toast
  const _this = this,
    _element = element,
    _config = {
      autohide: true,
      delay: 5000,
    };
  // установление _config
  for (let prop in config) {
    _config[prop] = config[prop];
  }
  // get-свойство element
  Object.defineProperty(this, 'element', {
    get: function () {
      return _element;
    },
  });
  // get-свойство config
  Object.defineProperty(this, 'config', {
    get: function () {
      return _config;
    },
  });
  // обработки события click (скрытие сообщения при нажатии на кнопку "Закрыть")
  _element.addEventListener('click', function (e) {
    if (e.target.classList.contains('toast__close')) {
      _this.hide();
    }
  });
};
// методы show и hide, описанные в прототипе объекта Toast
Toast.prototype = {
  show: function () {
    const _this = this;
    this.element.classList.add('toast_show');
    if (this.config.autohide) {
      setTimeout(function () {
        _this.hide();
      }, this.config.delay);
    }
  },
  hide: function () {
    this.element.classList.remove('toast_show');
  },
};
// статическая функция для Toast (используется для создания сообщения)
Toast.create = function (text, color) {
  const fragment = document.createDocumentFragment(),
    toast = document.createElement('div'),
    toastClose = document.createElement('button');
  toast.classList.add('toast');
  toast.style.backgroundColor =
    'rgba(' +
    parseInt(color.substr(1, 2), 16) +
    ',' +
    parseInt(color.substr(3, 2), 16) +
    ',' +
    parseInt(color.substr(5, 2), 16) +
    ',0.9)';
  toast.textContent = text;
  toastClose.classList.add('toast__close');
  toastClose.setAttribute('type', 'button');
  toastClose.textContent = '×';
  toast.appendChild(toastClose);
  fragment.appendChild(toast);
  return fragment;
};
// статическая функция для Toast (используется для добавления сообщения на страницу)
Toast.add = function (params) {
  const config = {
    header: 'Header',
    text: 'Message',
    color: '#ffffff',
    autohide: true,
    delay: 5000,
  };
  if (params !== undefined) {
    for (let item in params) {
      config[item] = params[item];
    }
  }
  if (!document.querySelector('.toasts')) {
    const container = document.createElement('div');
    container.classList.add('toasts');
    container.style.cssText = 'position: fixed; top: 15px; right: 15px; width: 300px;';
    document.body.appendChild(container);
  }
  document.querySelector('.toasts').appendChild(Toast.create(config.text, config.color));
  const toasts = document.querySelectorAll('.toast');
  const toast = new Toast(toasts[toasts.length - 1], {
    autohide: config.autohide,
    delay: config.delay,
  });
  toast.show();
  return toast;
};
