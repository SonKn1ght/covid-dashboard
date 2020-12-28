import { Toast } from './toaster';
import './css/style.css';
import * as soundAssets from './sounds/';

export const Keyboard = {
  elements: {
    main: null,
    keysContainer: null,
    keys: [],
    sounds: null,
    current: null,
  },

  eventHandlers: {
    oninput: null,
    onclose: null,
  },

  properties: {
    value: '',
    capsLock: false,
    lang: 'en',
    shift: false,
    position: 0,
    voice: false,
    sound: true,
  },

  // prettier-ignore
  keyLayout: {
    en: [
      '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'backspace',
      'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p',
      'caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'enter',
      'shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/',
      'done', 'voice', 'sound', 'lang', 'space', 'left', 'right'
    ],
    ru: [
      '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'backspace',
      'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ',
      'caps', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э', 'enter',
      'shift', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', ',', '.', '?',
      'done', 'voice', 'sound', 'lang', 'space', 'left', 'right'
    ],
  },

  sounds: {
    en: {
      shift: soundAssets.en.shift,
      caps: soundAssets.en.caps,
      backspace: soundAssets.en.backspace,
      enter: soundAssets.en.enter,
      space: soundAssets.en.space,
      sounds: soundAssets.en.sounds,
      lang: soundAssets.en.lang,
      default: soundAssets.en.def,
    },
    ru: {
      shift: soundAssets.ru.shift,
      caps: soundAssets.ru.caps,
      backspace: soundAssets.ru.backspace,
      enter: soundAssets.ru.enter,
      space: soundAssets.ru.space,
      sounds: soundAssets.ru.sounds,
      lang: soundAssets.ru.lang,
      default: soundAssets.ru.def,
    },
  },

  _initSounds() {
    this.elements.sounds = {
      ru: {},
      en: {},
    };
    this.elements.sounds.ru = {
      shift: this._initSoundElement('shift', 'ru'),
      caps: this._initSoundElement('caps', 'ru'),
      backspace: this._initSoundElement('backspace', 'ru'),
      enter: this._initSoundElement('enter', 'ru'),
      space: this._initSoundElement('space', 'ru'),
      sounds: this._initSoundElement('sounds', 'ru'),
      lang: this._initSoundElement('lang', 'ru'),
      default: this._initSoundElement('default', 'ru'),
    };

    this.elements.sounds.en = {
      shift: this._initSoundElement('shift', 'en'),
      caps: this._initSoundElement('caps', 'en'),
      backspace: this._initSoundElement('backspace', 'en'),
      enter: this._initSoundElement('enter', 'en'),
      space: this._initSoundElement('space', 'en'),
      sounds: this._initSoundElement('sounds', 'en'),
      lang: this._initSoundElement('lang', 'en'),
      default: this._initSoundElement('default', 'en'),
    };
  },

  _initSoundElement(btn, lang) {
    const element = document.createElement('audio');
    element.src = this.sounds[lang][btn];
    return element;
  },

  _soundSrc(name, lang) {
    return `./assets/sounds/${lang}/${name}`;
  },

  init() {
    // Create main elements
    this.elements.main = document.createElement('div');
    this.elements.keysContainer = document.createElement('div');
    this._initSounds();

    // Setup main elements
    this.elements.main.classList.add('keyboard', 'keyboard--hidden');
    this.elements.keysContainer.classList.add('keyboard__keys');
    this.elements.keysContainer.appendChild(this._createKeys());

    this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard__key');

    // Add to DOM
    this.elements.main.appendChild(this.elements.keysContainer);
    this.elements.main.addEventListener('mousedown', (e) => {
      e.preventDefault();
    });
    for (let sound in this.elements.sounds) {
      this.elements.main.appendChild(this.elements.sounds[sound].shift);
    }
    document.body.appendChild(this.elements.main);

    // Automatically use keyboard for elements with class .use-virtual-keyboard
    document.querySelectorAll('.use-virtual-keyboard').forEach((element) => {
      element.addEventListener('focus', (e) => {
        this.elements.current = element;
        this.open(
          element.value,
          (currentValue, args) => {
            element.value = currentValue;
            element.focus();
            if (this.properties.shift) {
              this._toggleShift();
            }
            if (args !== 'backspace') {
              this.properties.position++;
            }
            element.selectionStart = element.selectionEnd = this.properties.position;
          },
          () => {
            element.blur();
          }
        );
      });
      element.addEventListener('click', (e) => {
        this.properties.position = e.target.selectionStart;
      });
    });

    document.addEventListener('keydown', (e) => {
      this._handlePhysicalKeyboard(e);
    });

    document.addEventListener('keyup', (e) => {
      this._handlePhysicalKeyboard(e);
      this.properties.value = e.target.value;
      this.properties.position = e.target.selectionStart;
    });
  },

  _handlePhysicalKeyboard(e) {
    let symbol;

    if (e.key !== undefined) {
      symbol = e.key;
    } else if (e.keyIdentifier !== undefined) {
      symbol = String.fromCharCode(e.keyIdentifier);
    } else if (e.keyCode !== undefined) {
      symbol = String.fromCharCode(e.keyCode);
    }

    let key = symbol.toLowerCase();
    key = key === 'capslock' ? 'caps' : key;
    key = key === ' ' ? 'space' : key;
    key = key === 'arrowright' ? 'right' : key;
    key = key === 'arrowleft' ? 'left' : key;

    if (this._isEnglishKeyboard(key)) {
      this.properties.lang = 'ru';
      this._toggleLang();
    } else if (this._isRussianKeyboard(key)) {
      this.properties.lang = 'en';
      this._toggleLang();
    }

    let keyIndex = this.keyLayout[this.properties.lang].indexOf(key);
    if (keyIndex !== -1) {
      if (e.type === 'keydown') {
        this.elements.keys[keyIndex].classList.add('keyboard__key--active-once');
        if (key === 'caps') {
          this.properties.capsLock = !(e.getModifierState && e.getModifierState('CapsLock'));
          this._toggleCapsLock();
        }
        if (key === 'shift') {
          const prevShift = this.properties.shift;
          this.properties.shift = !(e.getModifierState && e.getModifierState('Shift'));
          this._toggleShift(this.properties.shift === prevShift);
        }
      } else if (e.type === 'keyup') {
        this.elements.keys[keyIndex].classList.remove('keyboard__key--active-once');
        if (key === 'shift') {
          this.properties.shift = true;
          this._toggleShift();
        }
      }
    }
  },

  _isEnglishKeyboard(key) {
    return key.length === 1 && /[a-zA-Z]/.test(key);
  },

  _isRussianKeyboard(key) {
    return key.length === 1 && /[а-яА-ЯЁё]/.test(key);
  },

  // Creates HTML for an icon
  _createIconHtml(iconName) {
    return `<i class="material-icons">${iconName}</i>`;
  },

  _createKeys() {
    const fragment = document.createDocumentFragment();
    const keyLayout = this.keyLayout;

    keyLayout[this.properties.lang].forEach((key) => {
      const keyElement = document.createElement('button');
      const insertLineBreak = ['backspace', 'p', 'enter', '/', '?', 'ъ'].indexOf(key) !== -1;

      // Add attributes/classes
      keyElement.setAttribute('type', 'button');
      keyElement.classList.add('keyboard__key');

      switch (key) {
        case 'backspace':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = this._createIconHtml('backspace');
          keyElement.addEventListener('click', (e) => {
            let { lang, value, position } = this.properties;
            if (position > 0) {
              this.properties.value = `${value.substring(
                0,
                position === 0 ? 0 : position - 1
              )}${value.substring(position, value.length)}`;
              this.properties.position = position <= 0 ? 0 : position - 1;
            }

            this._playSound(this.elements.sounds[lang].backspace);
            this._triggerEvent('oninput', 'backspace');
          });
          break;

        case 'caps':
          keyElement.classList.add('keyboard__key--wide', 'keyboard__key--activatable');
          keyElement.innerHTML = this._createIconHtml('keyboard_capslock');
          if (this.properties.capsLock) {
            keyElement.classList.add('keyboard__key--active');
          }
          keyElement.addEventListener('click', (e) => {
            this._toggleCapsLock();
            const lang = this.properties.lang;
            this._playSound(this.elements.sounds[lang].caps);
          });
          break;

        case 'enter':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = this._createIconHtml('keyboard_return');
          keyElement.addEventListener('click', (e) => {
            this._changeValueByPosition('\n');
            this._triggerEvent('oninput');
            const { lang } = this.properties;
            this._playSound(this.elements.sounds[lang].enter);
          });
          break;

        case 'shift':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = this._createIconHtml('keyboard_arrow_up');
          if (this.properties.shift) {
            keyElement.classList.add('keyboard__key--active-once');
          }
          keyElement.addEventListener('click', (e) => {
            this._toggleShift();
            const { lang } = this.properties;
            this._playSound(this.elements.sounds[lang].shift);
          });

          break;

        case 'done':
          keyElement.classList.add('keyboard__key--dark');
          keyElement.innerHTML = this._createIconHtml('keyboard_hide');
          keyElement.addEventListener('click', (e) => {
            this.close();
            const { lang } = this.properties;
            this._playSound(this.elements.sounds[lang].default);
            this._triggerEvent('onclose');
          });
          break;

        case 'voice':
          keyElement.classList.add('keyboard__key--dark');
          if (this.properties.voice) {
            keyElement.innerHTML = this._createIconHtml('mic_off');
            keyElement.classList.add('keyboard__key--active-once');
          } else {
            keyElement.innerHTML = this._createIconHtml('keyboard_voice');
          }
          keyElement.addEventListener('click', (e) => {
            try {
              window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

              const recognition = new window.SpeechRecognition();
              recognition.interimResults = true;
              const { lang } = this.properties;
              recognition.lang = lang === 'en' ? 'en-US' : 'ru-RU';
              this._playSound(this.elements.sounds[lang].enter);
              this._toggleVoice();
              const { voice } = this.properties;
              if (voice) {
                recognition.stop();
                recognition.start();
              } else {
                recognition.stop();
              }
              recognition.addEventListener('result', (e) => {
                const { lang } = this.properties;
                recognition.lang = lang === 'en' ? 'en-US' : 'ru-RU';
                const transcript = Array.from(e.results)
                  .map((result) => result[0])
                  .map((result) => result.transcript)
                  .join('');

                if (e.results[0].isFinal) {
                  this._changeValueByPosition(transcript + ' ');
                  this.properties.position += transcript.length;
                  this._triggerEvent('oninput');
                }
              });
              recognition.addEventListener('end', (e) => {
                try {
                  const { lang } = this.properties;
                  recognition.lang = lang === 'en' ? 'en-US' : 'ru-RU';
                  const { voice } = this.properties;
                  if (voice) {
                    recognition.stop();
                    recognition.start();
                  } else {
                    recognition.stop();
                  }
                } catch (error) {
                  recognition.stop();
                }
              });
            } catch (e) {
              if (typeof Toast !== 'undefined') {
                Toast.add({
                  text:
                    'Браузер не поддерживает распознавание речи! Протестируйте в Google Chrome!',
                  color: '#dc3545',
                  autohide: true,
                  delay: 5000,
                });
              }
              console.log("Browser doesn't support Speech Recognition");
            }
          });
          break;

        case 'sound':
          const sound = this.properties.sound;
          keyElement.classList.add('keyboard__key--dark');
          keyElement.innerHTML = sound
            ? this._createIconHtml('volume_off')
            : this._createIconHtml('volume_up');
          keyElement.addEventListener('click', (e) => {
            this._toggleSound();
            const sound = this.properties.sound;
            keyElement.innerHTML = sound
              ? this._createIconHtml('volume_off')
              : this._createIconHtml('volume_up');
            const { lang } = this.properties;
            this._playSound(this.elements.sounds[lang].sounds);
          });
          break;

        case 'lang':
          keyElement.classList.add('keyboard__key--dark');
          keyElement.innerHTML = this._toggleCase(this.properties.lang);
          keyElement.addEventListener('click', (e) => {
            this._toggleLang();
            keyElement.innerHTML = this.properties.lang;
            const { lang } = this.properties;
            this._playSound(this.elements.sounds[lang].lang);
          });
          break;

        case 'space':
          keyElement.classList.add('keyboard__key--extra-wide');
          keyElement.innerHTML = this._createIconHtml('space_bar');
          keyElement.addEventListener('click', (e) => {
            this._changeValueByPosition(' ');
            const { lang } = this.properties;
            this._playSound(this.elements.sounds[lang].space);
            this._triggerEvent('oninput');
          });
          break;

        case 'left':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = this._createIconHtml('arrow_back');
          keyElement.addEventListener('click', (e) => {
            const pos = this.properties.position - 1;
            this.properties.position = pos >= 0 ? pos : 0;
            const { lang } = this.properties;
            this._playSound(this.elements.sounds[lang].default);
            this._changePosition();
          });
          break;

        case 'right':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = this._createIconHtml('arrow_forward');
          keyElement.addEventListener('click', (e) => {
            const pos = this.properties.position + 1;
            const length = this.properties.value.length;
            this.properties.position = pos < length ? pos : length;
            const { lang } = this.properties;
            this._playSound(this.elements.sounds[lang].default);
            this._changePosition();
          });
          break;

        default:
          keyElement.textContent = this._toggleCase(key);
          keyElement.addEventListener('click', (e) => {
            this._changeValueByPosition(keyElement.textContent);
            this._triggerEvent('oninput');
            const { lang } = this.properties;
            this._playSound(this.elements.sounds[lang].default);
          });
          break;
      }

      fragment.appendChild(keyElement);

      if (insertLineBreak) {
        fragment.appendChild(document.createElement('br'));
      }
    });

    return fragment;
  },

  _changeValueByPosition(text) {
    const { position, value } = this.properties;
    const length = value.length;
    const keyVal = this._toggleCase(text);
    this.properties.value = `${value.slice(0, position)}${keyVal}${value.slice(position, length)}`;
  },

  async _playSound(audioElement) {
    if (this.properties.sound) {
      audioElement.currentTime = 0;
      try {
        await audioElement.play();
      } catch (error) {}
    }
  },

  _triggerEvent(handlerName, args) {
    if (typeof this.eventHandlers[handlerName] === 'function') {
      this.eventHandlers[handlerName](this.properties.value, args);
    }
  },

  _toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;
    const capsLock = this.properties.capsLock;
    for (const key of this.elements.keys) {
      if (key.childElementCount === 0) {
        key.textContent = this._toggleCase(key.textContent);
      } else {
        if (key.children[0].textContent === 'keyboard_capslock') {
          key.classList.toggle('keyboard__key--active', capsLock);
        }
      }
    }
  },

  _alternateKeys() {
    for (const key of this.elements.keys) {
      if (key.childElementCount === 0) {
        switch (key.textContent) {
          case ',':
            key.textContent = ';';
            break;
          case '.':
            key.textContent = ':';
            break;
          case '?':
            key.textContent = '/';
            break;
          case ';':
            key.textContent = ',';
            break;
          case ':':
            key.textContent = '.';
            break;
          case '/':
            key.textContent = '?';
            break;
          case '1':
            key.textContent = '!';
            break;
          case '2':
            if (this.properties.lang === 'en') {
              key.textContent = '@';
            } else {
              key.textContent = '"';
            }
            break;
          case '3':
            if (this.properties.lang === 'en') {
              key.textContent = '#';
            } else {
              key.textContent = '№';
            }
            break;
          case '4':
            key.textContent = '$';
            break;
          case '5':
            key.textContent = '%';
            break;
          case '6':
            key.textContent = '^';
            break;
          case '7':
            key.textContent = '&';
            break;
          case '8':
            key.textContent = '*';
            break;
          case '9':
            if (this.properties.lang === 'en') {
              key.textContent = '(';
            } else {
              key.textContent = '{';
            }
            break;
          case '0':
            if (this.properties.lang === 'en') {
              key.textContent = ')';
            } else {
              key.textContent = '}';
            }
            break;
          case '!':
            key.textContent = '1';
            break;
          case '@':
            key.textContent = '2';
            break;
          case '"':
            key.textContent = '2';
            break;
          case '#':
            key.textContent = '3';
            break;
          case '№':
            key.textContent = '3';
            break;
          case '$':
            key.textContent = '4';
            break;
          case '%':
            key.textContent = '5';
            break;
          case '^':
            key.textContent = '6';
            break;
          case '&':
            key.textContent = '7';
            break;
          case '*':
            key.textContent = '8';
            break;
          case '(':
            key.textContent = '9';
            break;
          case '{':
            key.textContent = '9';
            break;
          case ')':
            key.textContent = '0';
            break;
          case '}':
            key.textContent = '0';
            break;

          default:
            key.textContent = this._toggleCase(key.textContent);
            break;
        }
      }
    }
  },

  _toggleShift(changed = true) {
    this.properties.shift = !this.properties.shift;
    const shift = this.properties.shift;
    if (changed) {
      this._alternateKeys();
      for (const key of this.elements.keys) {
        if (key.childElementCount !== 0) {
          if (key.children[0].textContent === 'keyboard_arrow_up') {
            key.classList.toggle('keyboard__key--active-once', shift);
          }
        }
      }
    }
  },

  _changePosition() {
    const position = this.properties.position;
    this.elements.current.selectionStart = this.elements.current.selectionEnd = position;
  },

  _toggleVoice() {
    this.properties.voice = !this.properties.voice;
    const { lang, voice } = this.properties;
    const index = this.keyLayout[lang].indexOf('voice');
    if (index !== -1) {
      if (voice) {
        this.elements.keys[index].innerHTML = this._createIconHtml('mic_off');

        this.elements.keys[index].classList.add('keyboard__key--active-once');
      } else {
        this.elements.keys[index].innerHTML = this._createIconHtml('keyboard_voice');
        this.elements.keys[index].classList.remove('keyboard__key--active-once');
      }
    }
  },

  _toggleSound() {
    this.properties.sound = !this.properties.sound;
  },

  _toggleLang() {
    this.properties.lang = this.properties.lang === 'en' ? 'ru' : 'en';
    this.elements.keysContainer.innerHTML = '';
    this.elements.keysContainer.appendChild(this._createKeys());

    this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard__key');

    if (this.properties.shift) {
      this._alternateKeys();
    }
  },

  _toggleCase(key) {
    return this._isUpperCase() ? key.toUpperCase() : key.toLowerCase();
  },

  _isUpperCase() {
    return (
      (this.properties.shift && !this.properties.capsLock) ||
      (!this.properties.shift && this.properties.capsLock)
    );
  },

  onInput(element) {
    if (!element) {
      return;
    }

    return (currentValue, args) => {
      element.value = currentValue;
      element.focus();
      element.dispatchEvent(new Event('input', { bubbles: true }));

      if (this.properties.shift) {
        this._toggleShift();
      }

      if (args !== 'backspace') {
        this.properties.position++;
      }

      element.selectionStart = element.selectionEnd = this.properties.position;
    };
  },

  onClose(element) {
    if (!element) {
      return;
    }

    return () => {
      element.blur();
    };
  },

  open(initialValue, oninput, onclose, element) {
    if (element) {
      element.addEventListener('click', (e) => {
        this.properties.position = e.target.selectionStart;
      });
    }

    this.properties.value = initialValue || '';
    this.elements.current = element || this.elements.current;
    this.eventHandlers.oninput = oninput || this.onInput(element);
    this.eventHandlers.onclose = onclose || this.onClose(element);
    this.elements.main.classList.remove('keyboard--hidden');
  },

  close() {
    this.properties.value = '';
    this.elements.main.classList.add('keyboard--hidden');
  },
};
