import React from "react";
// importing useEffect hook and its dependency array so that component can be used after specific actions.
const ScrollToTop = () => {
  const scrollToTop = () =>
    window.scrollTo(0, 0); /* scrolling to top of page with smooth animation if
available or else directly will move upwards due browser support for this feature is not there yet in current
versions like latest react version (17). In future releases it should have more reliable way/feature
    */
  return <button onClick={scrollToTop}>Scroll To Top</button>;
  /* you can replace the button with any html
element as per your requirement.*/
};
export default ScrollToTop;
