/// <reference path="../typings/index.d.ts" />
import "@replikit/attachments";

export * from "./views/counterView";
export * from "./views/confirmationView";

export * from "./sessions/randomUserSession";
export * from "./randomLocale";
export * from "./startup";

import "./locales/en";
import "./locales/ru";

import "./commands/calc";
import "./commands/delete";
import "./commands/test";
import "./commands/edit";
import "./commands/tokenize";
import "./commands/format";
import "./commands/echo";
import "./commands/avatar";
import "./commands/button";
import "./commands/counter";
import "./commands/confirmation";

import "./handlers/silence";
import "./handlers/random";
import "./handlers/inline";
import "./handlers/button";
