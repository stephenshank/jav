import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, NavLink } from "react-router-dom";
import "bootstrap";
import "bootstrap/scss/bootstrap.scss";
const $ = require("jquery");

import Home from "./app/home.jsx";
import FASTA from "./app/FASTA.jsx";
import FNA from "./app/FNA.jsx";
import BAM from "./app/BAM.jsx";
import Components from "./app/Components.jsx";
import "./app/styles.scss";

function Divider(props) {
  return [
    <div className="dropdown-divider" key="divider-div" />,
    props.header ? (
      <h6 className="dropdown-header" key="divider-header">
        {props.header}
      </h6>
    ) : null
  ];
}

function Link(props) {
  return (
    <NavLink className="dropdown-item link" to={props.to}>
      {props.header}
    </NavLink>
  );
}

function Dropdown(props) {
  return (
    <ul className="navbar-nav ">
      <li className="nav-item dropdown">
        <a
          className="nav-link dropdown-toggle"
          href="#"
          id="navbarDropdown"
          role="button"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          {props.title}
        </a>
        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
          {props.children}
        </div>
      </li>
    </ul>
  );
}

function FASTALinks(props) {
  return (
    <Dropdown title={"FASTA"}>
      <Link to="/fasta-viewer" header="Viewer" />
      <Divider header="Examples" />
      <Link to="/fasta-aminoacid" header="Amino acid alignment" />
      <Link to="/fasta-highlight" header="Highlight individual sites" />
      <Link to="/fasta-start" header="Start at a given sequence and site" />
      <Link to="/fasta-lowercase" header="Lower case alignment" />
      <Link to="/fasta-svg" header="SVG alignment" />
    </Dropdown>
  );
}

function FNALinks(props) {
  return (
    <Dropdown title={"FNA"}>
      <Link to="/fna-viewer" header="Viewer" />
      <Divider header="Examples" />
      <Link to="/fna-immunology" header="Immunology - heavy chain regions" />
      <Link to="/fna-hiv" header="HIV - site annotations" />
    </Dropdown>
  );
}

function BAMLinks(props) {
  return (
    <Dropdown title={"BAM"}>
      <Link to="/sam-viewer" header="Viewer" />
      <Divider header="Examples" />
      <Link to="/sam-variantcaller" header="Variant caller" />
    </Dropdown>
  );
}

function NavBar(props) {
  const show_import_export = props.viewing == "alignment";
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <NavLink className="navbar-brand" to="/">
          Javascript Alignment Viewer
        </NavLink>
        <div className="collapse navbar-collapse">
          <FASTALinks />
          <FNALinks />
          <BAMLinks />
        </div>
      </nav>
    </div>
  );
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    };
  }

  render() {
    return (
      <div>
        <NavBar />
        <div style={{ maxWidth: 1140 }} className="container-fluid">
          <Route exact path="/" render={props => <Home />} />

          <Route path="/fasta-viewer" render={props => <FASTA.FASTAViewer />} />
          <Route path="/fasta-aminoacid" component={FASTA.AminoAcid} />
          <Route path="/fasta-highlight" component={FASTA.Highlight} />
          <Route path="/fasta-start" component={FASTA.StartAtSiteAndSequence} />
          <Route path="/fasta-lowercase" component={FASTA.Lowercase} />
          <Route path="/fasta-svg" component={FASTA.SVGAlignmentExample} />

          <Route path="/fna-viewer" component={FNA.FNAViewer} />
          <Route path="/fna-immunology" component={FNA.Immunology} />
          <Route path="/fna-hiv" component={FNA.HIV} />

          <Route path="/sam-viewer" component={BAM.BAMViewer} />
          <Route path="/sam-variantcaller" component={BAM.VariantCaller} />

          <Route path="/base-svg-tree" component={Components.BaseSVGTree} />
        </div>
      </div>
    );
  }
}

function Main(props) {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

/* Temporary fix for a breaking change in Chrome to React
 * See https://github.com/facebook/react/issues/14856
 */
const EVENTS_TO_MODIFY = [
  "touchstart",
  "touchmove",
  "touchend",
  "touchcancel",
  "wheel"
];

const originalAddEventListener = document.addEventListener.bind();
document.addEventListener = (type, listener, options, wantsUntrusted) => {
  let modOptions = options;
  if (EVENTS_TO_MODIFY.includes(type)) {
    if (typeof options === "boolean") {
      modOptions = {
        capture: options,
        passive: false
      };
    } else if (typeof options === "object") {
      modOptions = {
        ...options,
        passive: false
      };
    }
  }

  return originalAddEventListener(type, listener, modOptions, wantsUntrusted);
};

const originalRemoveEventListener = document.removeEventListener.bind();
document.removeEventListener = (type, listener, options) => {
  let modOptions = options;
  if (EVENTS_TO_MODIFY.includes(type)) {
    if (typeof options === "boolean") {
      modOptions = {
        capture: options,
        passive: false
      };
    } else if (typeof options === "object") {
      modOptions = {
        ...options,
        passive: false
      };
    }
  }
  return originalRemoveEventListener(type, listener, modOptions);
};
// End of temporary fix

ReactDOM.render(
  <Main />,
  document.body.appendChild(document.createElement("div"))
);
