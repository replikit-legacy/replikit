/// <reference path="../typings/index.d.ts" />
import "@replikit/attachments";

export * from "./views/counterView";
export * from "./views/confirmationView";
export * from "./views/universityView";

export * from "./sessions/randomUserSession";
export * from "./randomLocale";
export * from "./startup";

import "./locales/en";
import "./locales/ru";

import "./commands";

import "./handlers/silence";
import "./handlers/random";
import "./handlers/inline";
import "./handlers/button";
