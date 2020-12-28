import * as React from 'react';
import './protect-popup.css';
import { useDispatch } from "react-redux";
import { setPopupState } from "@store";

export const ProtectPopup = () => {
  const dispatch = useDispatch();
  const closePopup = () => dispatch(setPopupState());

  return <div className="protect-popup">
    <div className="protect-popup__cross-close" onClick={closePopup}>
      <svg className="menu__close" width="25" height="25" viewBox="0 0 12 12" fill="#ffffff"
           xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd"
              d="M7.42618 6.00003L11.7046 1.72158C12.0985 1.32775 12.0985 0.689213 11.7046 0.295433C11.3108 -0.0984027
                 10.6723 -0.0984027 10.2785 0.295433L5.99998 4.57394L1.72148 0.295377C1.32765 -0.098459 0.68917 -0.098459
                 0.295334 0.295377C-0.0984448 0.689213 -0.0984448 1.32775 0.295334 1.72153L4.57383 5.99997L0.295334
                 10.2785C-0.0984448 10.6723 -0.0984448 11.3108 0.295334 11.7046C0.68917 12.0985 1.32765 12.0985 1.72148
                 11.7046L5.99998 7.42612L10.2785 11.7046C10.6723 12.0985 11.3108 12.0985 11.7046 11.7046C12.0985 11.3108
                 12.0985 10.6723 11.7046 10.2785L7.42618 6.00003Z" fill="ffffff"/>
      </svg>
    </div>
      <h3 className='protect-popup__title'>How Does the Coronavirus Spread?</h3>
      <p>
        The virus spreads mostly through droplets that people send out when they talk, sneeze, or cough.
        These usually don’t stay in the air for long or go farther than 6 feet. But the coronavirus might also
        travel through tiny aerosol particles that can linger for up to 3 hours and travel farther away.
        This is why wearing a facial covering can be important. It can keep you from giving
        it to others as well as helping you avoid breathing it in.

        You might also catch the coronavirus if you touch something that an infected person has touched and then touch your eyes, nose, or mouth.
      </p>

      <h3>Wash Your Hands</h3>
      <p>
        Soap, water, and some scrubbing are all it takes to kill viruses on your hands.
        You probably already know the usual times you should wash your hands, including before and after you handle food and after you:
      </p>
      <ul>
        <li>Use the toilet</li>
        <li>Change a diaper</li>
        <li>Blow your nose</li>
        <li>Touch garbage</li>
        <li>Care for a sick person</li>
        <li>Touch animals or their waste</li>
      </ul>

      <h3>Wear a Mask</h3>
      <p>Even if you don't show symptoms, you could carry the COVID-19 virus. People more than 2 years
        old should wear a cloth face mask in public. You don’t need the kind of face masks that health care
        workers wear. Any kind of mask can work, as long as:
      </p>
      <ul>
        <li>You can fit it snugly over your nose and mouth with no gaps.</li>
        <li>You can tie it behind your head or hook it onto your ears.</li>
        <li>It has several layers of fabric.</li>
        <li>It allows you to breathe.</li>
        <li>You can wash it without damaging it.</li>
      </ul>

      <h3>Stay Home</h3>
      <p>
        The fewer people you’re around, the lower your chance of infection.
        When you stay home, you help stop the spread to others, too.
        Try to stay out of crowded places. If your community is under shelter-in-place orders,
        follow guidelines for when you can go out.
      </p>

      <h3>Keep 6 Feet Away From Others</h3>
      <p>
        The main way COVID-19 spreads is from person-to-person contact.
        “Contact” is more than touching. When someone coughs or sneezes near you,
        droplets from their nose and mouth go into the air. Droplets from a person
        with COVID-19 have the virus in them. If you breathe the droplets in, the virus gets into your system.
      </p>
      <p></p>
        The CDC reports there is evidence the virus can be transmitted if you
        get within 6 feet of someone who is infectious for a total of 15 minutes
        throughout a day. It had previously been believed the exposure had to be 15 minutes at a time.
      <p>
        To protect yourself, you should practice social distancing. This includes staying at least 6 feet away from other people.
      </p>
  </div>
}
