# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.23.3](https://github.com/replikit/replikit/compare/v0.23.2...v0.23.3) (2021-10-27)


### Bug Fixes

* **discord:** Fix webhook creation issue ([d639759](https://github.com/replikit/replikit/commit/d639759708a1b451e96880182550b8512a70c8ab))





## [0.23.2](https://github.com/replikit/replikit/compare/v0.23.1...v0.23.2) (2021-10-25)

**Note:** Version bump only for package replikit





## [0.23.1](https://github.com/replikit/replikit/compare/v0.23.0...v0.23.1) (2021-10-25)


### Bug Fixes

* **discord:** Fix avatar issues ([c4c7a9b](https://github.com/replikit/replikit/commit/c4c7a9b014d2c62a3bde2e1e171914e3144c7fa2))





# [0.23.0](https://github.com/Exeteres/Replikit/compare/v0.22.2...v0.23.0) (2020-12-14)


### Bug Fixes

* **commands:** Fix min and max converter options ([8d73aac](https://github.com/Exeteres/Replikit/commit/8d73aac0625f01446bb34ef63a578a08091fff55))


### Features

* **discord:** Add support for incoming replies ([e766172](https://github.com/Exeteres/Replikit/commit/e7661725f2cdf1df2462e38ba003c410156c077a))
* **discord:** Update discord backend ([4718572](https://github.com/Exeteres/Replikit/commit/4718572155dc02be1e0e7979b4092f0ecf2069ed))
* **sessions:** Allow custom session keys ([304d411](https://github.com/Exeteres/Replikit/commit/304d4114287d29b27f35145ff036c44a90f5def5))
* **storage:** Update mongodb driver ([f4ef11d](https://github.com/Exeteres/Replikit/commit/f4ef11dbdd3f36bd1fde44090aa9e1fdc219b30d))
* **views:** Add force text views ([ae5f436](https://github.com/Exeteres/Replikit/commit/ae5f436cdc753cc378c981f56542dbfe45461a67))
* **vk:** Update vk backend ([9066938](https://github.com/Exeteres/Replikit/commit/9066938bb70552b1a74b3fb112653b9ade86b24f))





## [0.22.2](https://github.com/Exeteres/Replikit/compare/v0.22.1...v0.22.2) (2020-10-23)


### Bug Fixes

* **storage:** Fix build ([ce82ce3](https://github.com/Exeteres/Replikit/commit/ce82ce332bcda0bc645c407b356431ab3fac3e25))





## [0.22.1](https://github.com/Exeteres/Replikit/compare/v0.22.0...v0.22.1) (2020-10-23)


### Bug Fixes

* **storage:** Fix username index ([ec1ed7f](https://github.com/Exeteres/Replikit/commit/ec1ed7fa5a8bbea26923350a434ccbdd241c1488))





# [0.22.0](https://github.com/Exeteres/Replikit/compare/v0.21.0...v0.22.0) (2020-10-23)


### Bug Fixes

* **cli:** Remove irrelevant prompts ([9f66d92](https://github.com/Exeteres/Replikit/commit/9f66d92d99b0b7741ef512ab5c3fe5a8d7c2488a))
* **discord:** Add language to AccountInfo ([6a06a27](https://github.com/Exeteres/Replikit/commit/6a06a27171b02487d0a5886c9c47f119a9767d51))
* **help:** Improve help message ([e313441](https://github.com/Exeteres/Replikit/commit/e313441ecb66e948918e7d456b37b7d8a28af8d6))


### Features

* **cli:** Add commands to remove modules and external repositories ([4b96040](https://github.com/Exeteres/Replikit/commit/4b960406fa4eab9a1e1536f5016cf4153581db5f))
* **cli:** Add dependency resolution mechanism to addExternal command ([84eeb29](https://github.com/Exeteres/Replikit/commit/84eeb29b1418f0b43ef1fbf0b828250b121ccb9c))
* **cli:** Update tsconfig generator ([4bea549](https://github.com/Exeteres/Replikit/commit/4bea5497b03dbb947366885826dc0ca16052cadc))





# [0.21.0](https://github.com/Exeteres/Replikit/compare/v0.20.0...v0.21.0) (2020-10-17)


### Bug Fixes

* **commands:** Fix usage rendering of class-like commands ([1d9b7aa](https://github.com/Exeteres/Replikit/commit/1d9b7aa193fc9d0e62e30315e872e1188f1ae299))
* **i18n:** Fix typo ([32fe69f](https://github.com/Exeteres/Replikit/commit/32fe69f779857194bfeab5eef7c7dc4ca11221b8))
* **storage:** Fix command parameters ([136f4d2](https://github.com/Exeteres/Replikit/commit/136f4d24d23528316e05582a193f40f757d24110))


### Features

* **authorization:** Extract authorization logic to middleware and allow it to be used in class-like commands ([4812d28](https://github.com/Exeteres/Replikit/commit/4812d28c932163fe23e1f21fb5e6dd900be41cf5))
* **commands:** Add ability to use middleware resolvers ([2328341](https://github.com/Exeteres/Replikit/commit/2328341f37839479af13ae2f9fcdcfe0728fd486))
* **core:** Add inlineButtons feature flag ([a9078d5](https://github.com/Exeteres/Replikit/commit/a9078d530e84b953f5ac194c281cf374ff87741f))
* **sessions:** Redesign session keys. Add ability to search sessions ([32b4d54](https://github.com/Exeteres/Replikit/commit/32b4d547f987cae06b85d511056de6de95545f32))
* **storage:** Add getAccount method ([a0fc12c](https://github.com/Exeteres/Replikit/commit/a0fc12cb330c3097df51c41554a8c9b995567825))
* **views:** Add text fallback mechanism and authentication ([d6e926d](https://github.com/Exeteres/Replikit/commit/d6e926d98a9fc10c18db52dee6d8145fae2d14bd))





# [0.20.0](https://github.com/Exeteres/Replikit/compare/v0.19.0...v0.20.0) (2020-09-28)


### Bug Fixes

* **sessions:** Fix memory session storage ([55f0a0a](https://github.com/Exeteres/Replikit/commit/55f0a0a4b39ed0b2621582c7860db23cbe1253d1))


### Features

* **commands:** Add class-like command syntax ([7186d22](https://github.com/Exeteres/Replikit/commit/7186d2212ffdd1b0f2062b652e96719a919e9121))
* **core:** Add composition system ([5275ecc](https://github.com/Exeteres/Replikit/commit/5275ecc0b93875f7d1cddceb74ac28f873c49863))
* **storage:** Add parameters for class-like commands ([7a1cbf2](https://github.com/Exeteres/Replikit/commit/7a1cbf22ee5be836c51bc249555bc7679442bb74))
* **views:** Update to use composition system ([30733ba](https://github.com/Exeteres/Replikit/commit/30733ba119d99eba8a2085ae8c5f2681d00bd9f6))
* Add ability to create multiple button rows ([2a83a74](https://github.com/Exeteres/Replikit/commit/2a83a7432c102ff77e71cd4d542fdb4ec99ac7ad))





# [0.19.0](https://github.com/Exeteres/Replikit/compare/v0.18.2...v0.19.0) (2020-09-18)


### Bug Fixes

* **cli:** Use @replikit/cli instead of replikit ([1d99cdb](https://github.com/Exeteres/Replikit/commit/1d99cdb49f12ab1baef1dcf1be727046c8a40b33))
* **discord:** Add support for links and dm channels ([96b0c13](https://github.com/Exeteres/Replikit/commit/96b0c13b1ba7ff754ba00f6c0640888a6a987edd))
* **sessions:** Fix MongoSessionStorage ([2a4702d](https://github.com/Exeteres/Replikit/commit/2a4702d34ec2b9df298f1bc26b2581696a1feefc))
* **telegram:** Fix formatting in editMessage method ([7726e80](https://github.com/Exeteres/Replikit/commit/7726e80c0bb829d117fb7ded79ea565486b76f16))


### Features

* **core:** Add support for inline buttons ([d39240c](https://github.com/Exeteres/Replikit/commit/d39240ca7f7fdd7302e98b514ac3893682995fda))
* **messages:** Add addButton method ([1d7f3a0](https://github.com/Exeteres/Replikit/commit/1d7f3a0adb2b31e02707f4093e0ec7d828797403))
* **messages:** Add OutMessageLike type and utils ([a9fb59c](https://github.com/Exeteres/Replikit/commit/a9fb59cb432419fadd3a51e79d135ac29c9087b5))
* **messages:** Add token factories and support for buttons ([2275483](https://github.com/Exeteres/Replikit/commit/227548389a70cf64756c298951241ea96fbd77c4))
* **router:** Add support for buttons ([6011d74](https://github.com/Exeteres/Replikit/commit/6011d74acff02a6f9db93778f2578cb6ea69b6f7))
* **sessions:** Redesign session system ([aa9c505](https://github.com/Exeteres/Replikit/commit/aa9c50519def6c210a5069b157c4f4f0de06e35c))
* **views:** Add experimental view system ([8874b49](https://github.com/Exeteres/Replikit/commit/8874b493152ff228b645f25baa8a034ea4383795))
* Add animation support ([3fe6611](https://github.com/Exeteres/Replikit/commit/3fe661176d558217b66e663e5071452f9d218987))
* Add support for switchInline button ([506f93e](https://github.com/Exeteres/Replikit/commit/506f93eec1788bc9d5b4ae40c1ccd615b13cbe52))
* **storage:** Add more useful methods ([e5cefa5](https://github.com/Exeteres/Replikit/commit/e5cefa5545a833af0574d74752ab6581103c5374))
* **telegram:** Add support for inline buttons ([66488b9](https://github.com/Exeteres/Replikit/commit/66488b9bd5bea2e1551920694f4d4f51a58ab95b))
* **vk:** Add support for videos ([a65a280](https://github.com/Exeteres/Replikit/commit/a65a280ed021e1f6d2d3edd930146958e994634c))





## [0.18.2](https://github.com/Exeteres/Replikit/compare/v0.18.1...v0.18.2) (2020-09-09)


### Bug Fixes

* **telegram:** Fix another bug in avatar resolution ([302ae08](https://github.com/Exeteres/Replikit/commit/302ae08b94926987364caa633607bd77fdb0dd48))
* **vk:** Fix sending messages with multiple attachments ([2dc3b52](https://github.com/Exeteres/Replikit/commit/2dc3b521361dba17e5724e7f8fff26e424703118))





## [0.18.1](https://github.com/Exeteres/Replikit/compare/v0.18.0...v0.18.1) (2020-09-09)


### Bug Fixes

* **core:** Allow caching of undefined values ([7a5b80f](https://github.com/Exeteres/Replikit/commit/7a5b80f52f102c325788109a6fe454c5242849bc))
* **telegram:** Fix attachment aggregation ([e484d7f](https://github.com/Exeteres/Replikit/commit/e484d7fd0117c7fca0e90675b701ff2d7c17f8a0))
* **telegram:** Fix bug in avatar resolution ([de1f82c](https://github.com/Exeteres/Replikit/commit/de1f82cc70fc335655bfb9be5ee05643be368736))





# [0.18.0](https://github.com/Exeteres/Replikit/compare/v0.17.3...v0.18.0) (2020-09-09)


### Bug Fixes

* **cli:** Fix discord controller bundling ([b399f46](https://github.com/Exeteres/Replikit/commit/b399f46deeed3dc596ad5afcd9d56a1f3bb5e724))
* **discord:** Fix channel detection in guild-specific events ([be7f00c](https://github.com/Exeteres/Replikit/commit/be7f00cf2469b8c8b1b0e7552165f90de089d023))


### Features

* **core:** Allow sending attachments with implicit controllerName ([213f662](https://github.com/Exeteres/Replikit/commit/213f662e7a97ae81510379f6744756227c4db30f))
* Improve avatar field ([a0d28db](https://github.com/Exeteres/Replikit/commit/a0d28db296c4764f1a2aafb8641123534e1d5009))





## [0.17.3](https://github.com/Exeteres/Replikit/compare/v0.17.2...v0.17.3) (2020-08-25)


### Bug Fixes

* **cli:** Fix ts-node-dev binary path ([20a0dcd](https://github.com/Exeteres/Replikit/commit/20a0dcd8b45ff9bb2bba5bd25f87ba91228755d9))
* **discord:** Update discord backend ([470947f](https://github.com/Exeteres/Replikit/commit/470947fd3f1d214469186da0539bb24181c7c029))
* **storage:** Fix "getInfo" and "delete" methods ([75daea3](https://github.com/Exeteres/Replikit/commit/75daea3a85a04102e34d08d309dfc4ae2ecff8bf))
* **vk:** Update vk backend ([bfee3e7](https://github.com/Exeteres/Replikit/commit/bfee3e7e740aaff7bd77cc44bccd60939ee57b90))





## [0.17.2](https://github.com/Exeteres/Replikit/compare/v0.17.1...v0.17.2) (2020-08-24)


### Bug Fixes

* **cli:** Fix several bugs in webpack configuration ([5ce34dc](https://github.com/Exeteres/Replikit/commit/5ce34dc818907ba09ac63256a946141dc2b13f98))
* **discord:** Increase retryLimit ([e00dd11](https://github.com/Exeteres/Replikit/commit/e00dd11054203706f2ad2823dbc392efa8e8522f))
* **permissions:** Expose registerPermissionsConverters function ([b2f2c3b](https://github.com/Exeteres/Replikit/commit/b2f2c3b06ab1f316df69cf568be13c77b9c5355c))
* **storage:** Fix caching issue ([f2df8db](https://github.com/Exeteres/Replikit/commit/f2df8db888519ac43bb6345b722005246dc5c38f))





## [0.17.1](https://github.com/Exeteres/Replikit/compare/v0.17.0...v0.17.1) (2020-08-21)

**Note:** Version bump only for package replikit





# [0.17.0](https://github.com/Exeteres/Replikit/compare/v0.16.0...v0.17.0) (2020-08-21)


### Bug Fixes

* **authorization:** Fix bug with user resolution ([c3b12ee](https://github.com/Exeteres/Replikit/commit/c3b12eedc1b3fcd548c486ba5fb919ef920a2a63))


### Features

* **core:** Add Identifier type ([e97ef90](https://github.com/Exeteres/Replikit/commit/e97ef90d24068fe4c16842b17bae0b8e6570ec47))
* **discord:** Update controller to use Identifier type ([8382577](https://github.com/Exeteres/Replikit/commit/83825773a78c3be41b7f15d23825cfa88a58b32e))
* **storage:** Update to use Identifier type and fix issue with username conflicts ([903c47d](https://github.com/Exeteres/Replikit/commit/903c47d57b8ca65de57ae1f384118f565cecfeb1))
* **telegram:** Update controller to use Identifier type ([eafe441](https://github.com/Exeteres/Replikit/commit/eafe4417de82e594cd6e1ee7fc4f6ef1f6491a6e))
* **vk:** Update controller to use Identifier type ([b8b51ad](https://github.com/Exeteres/Replikit/commit/b8b51adf348b1d8a8536661459087a9cdaad6d1c))





# [0.16.0](https://github.com/Exeteres/Replikit/compare/v0.15.1...v0.16.0) (2020-08-18)


### Bug Fixes

* **core:** Fix bug in text tokenization system ([43404bf](https://github.com/Exeteres/Replikit/commit/43404bffdb878e1f4abd18f69970cd6520251dd9))


### Features

* **core:** Add support for message headers ([5754c94](https://github.com/Exeteres/Replikit/commit/5754c94e0f89edb4ff3dde4fe410ade303bfb58f))
* **discord:** Add Discord controller ([d7f9ee2](https://github.com/Exeteres/Replikit/commit/d7f9ee2c726ee341d4c0c4c24cf9e7ab5480ff1a))
* **messages:** Add methods to work with message headers ([f412a28](https://github.com/Exeteres/Replikit/commit/f412a280c4a185a8066fec2b8492bc4afd8d8431))
* **storage:** Add support for repository extensions (custom repositories) ([468ec2e](https://github.com/Exeteres/Replikit/commit/468ec2ee14d0463e6d5d54939836691537cebbaa))





## [0.15.1](https://github.com/Exeteres/Replikit/compare/v0.15.0...v0.15.1) (2020-08-13)

**Note:** Version bump only for package replikit





# [0.15.0](https://github.com/Exeteres/Replikit/compare/v0.14.0...v0.15.0) (2020-08-13)


### Bug Fixes

* **sessions:** Fix invalid session comparison ([8e74de1](https://github.com/Exeteres/Replikit/commit/8e74de11ff79cc032d9b6b55a6598e1f7c46d7a2))
* **telegram:** Fix error in attachment resolution process ([b46a253](https://github.com/Exeteres/Replikit/commit/b46a2537df0b1939171ce70ce9186d5401ee993e))


### Features

* **cli:** Add ability to include modules from external repositories ([1376bb7](https://github.com/Exeteres/Replikit/commit/1376bb7513bb518dfdd47975e1695d697fda1e52))





# [0.14.0](https://github.com/Exeteres/Replikit/compare/v0.13.0...v0.14.0) (2020-08-05)


### Bug Fixes

* **cli:** Fix typings ([9851fe5](https://github.com/Exeteres/Replikit/commit/9851fe5b87e07318da5c085f4b1bbddb23984136))
* **i18n:** Allow getLocale method for inline query contexts ([48c5836](https://github.com/Exeteres/Replikit/commit/48c5836d55294f777a0c6bb8ff605bd57e23e877))
* **permissions:** Fix permission check issue ([9ac9cef](https://github.com/Exeteres/Replikit/commit/9ac9cefdf637850fac1d10f9c92260f7907b2bc8))
* **router:** Fix typings for inline query contexts ([e2adfb9](https://github.com/Exeteres/Replikit/commit/e2adfb97409a8d002ac48a6e48c491b4b86c47cd))


### Features

* **cli:** Add ability to modify webpack configuration ([7375e56](https://github.com/Exeteres/Replikit/commit/7375e56262f1b38767286fe4c6de74927264247d))
* **messages:** Add ability to use addLine method without text ([3886f11](https://github.com/Exeteres/Replikit/commit/3886f113aa94943afea2bd5f4f94462eccec055e))





# [0.13.0](https://github.com/Exeteres/Replikit/compare/v0.12.1...v0.13.0) (2020-08-04)


### Bug Fixes

* **authorization:** Fix some bugs in authorization system ([5d0f0d3](https://github.com/Exeteres/Replikit/commit/5d0f0d339c41e3982b9f165685101fd6a3a6998c))
* **core:** Fix constructor type ([9687c48](https://github.com/Exeteres/Replikit/commit/9687c48773917919a2d8c38add27fba15cc11f00))
* **i18n:** Fix bug with invalid locale resolution in MemberContext ([a1af23d](https://github.com/Exeteres/Replikit/commit/a1af23d764f417dcbceef3eba877d28b6e0b8b03))
* **replikit:** Fix @replikit/cli dependency version ([2566dfa](https://github.com/Exeteres/Replikit/commit/2566dfa37e12dd6823c1c35dd2e3d17f2cd9ecc4))


### Features

* **commands:** Add ability to use function as default value resolver ([6d8014f](https://github.com/Exeteres/Replikit/commit/6d8014f88777a15f3c50c96ddd29c0dba10ef0ae))
* **core:** Add ability to use pipe method in builders ([95c3cca](https://github.com/Exeteres/Replikit/commit/95c3cca0d1f4c5203fde3386c3775ecc77b92a1b))
* **hooks:** Add hooks to work with storage parameters ([09536f2](https://github.com/Exeteres/Replikit/commit/09536f2082364c46a8c14b70694e08e4b27e0b8e))
* **messages:** Add ability to use pipe method in MessageBuilder ([f5fe039](https://github.com/Exeteres/Replikit/commit/f5fe0391708753b7404e6c695a77cd793e83120c))
* **messages:** Add alias to use message with metadata as metadata ([e315a25](https://github.com/Exeteres/Replikit/commit/e315a256dfeef85137f640e08176d14c84a1638f))
* **permissions:** Add command parameter converters ([1ead835](https://github.com/Exeteres/Replikit/commit/1ead83526994aaeaa49322a797918211cb628944))
* **storage:** Redesign "channel", "user" and "member" parameters ([8c3ed96](https://github.com/Exeteres/Replikit/commit/8c3ed962534e74e209a33bb4d4ad6f867a8f6933))





## [0.12.1](https://github.com/Exeteres/Replikit/compare/v0.12.0...v0.12.1) (2020-07-30)

**Note:** Version bump only for package replikit





# [0.12.0](https://github.com/Exeteres/Replikit/compare/v0.11.2...v0.12.0) (2020-07-30)


### Bug Fixes

* **authorization:** Fix extensions to use new core types ([c756c73](https://github.com/Exeteres/Replikit/commit/c756c73edb0072760789846bf8e43894b25d4f27))
* **core:** Rename query field to text ([4b0a930](https://github.com/Exeteres/Replikit/commit/4b0a930a4a840efcf56bdc6dfcf0b77a9430a30c))
* **sessions:** Fix bug with session change detection ([037e3de](https://github.com/Exeteres/Replikit/commit/037e3debdfdca15b80289233c5bcddf9d53e45a4))
* **storage:** Fix extensions to use new core types ([75b9591](https://github.com/Exeteres/Replikit/commit/75b9591fda60d9764bfd3db512062f35cd28e0a0))


### Features

* **authorization:** Redesign authorization system ([6dd23d1](https://github.com/Exeteres/Replikit/commit/6dd23d1b0bf830bb7dcf8007987d671bd2814c92))
* **core:** Refactor types and add support for inline queries ([2e52258](https://github.com/Exeteres/Replikit/commit/2e52258587cf0f2d31061c991eb2489ec7acda9e))
* **hooks:** Add useChannel hook ([265c4de](https://github.com/Exeteres/Replikit/commit/265c4de8f17ea1db9c63e8900be28e1c50e5ae14))
* **permissions:** Redesign permission system ([3463834](https://github.com/Exeteres/Replikit/commit/3463834dbdf7fb3fe3d0ed34d10edccba5b0e4d0))
* **router:** Add support for new core types ([55242f2](https://github.com/Exeteres/Replikit/commit/55242f290b7bd053ed85dfa3f0412c2cd0a8f990))
* **sessions:** Add support for new core types ([7ec4756](https://github.com/Exeteres/Replikit/commit/7ec4756db3b638cfc3184473b8f182db64604733))
* **storage:** Add entity extension system ([6889986](https://github.com/Exeteres/Replikit/commit/6889986bf28d2084c742645904e7c93ddd0de0f6))
* **telegram:** Add support for inline queries ([3f0271c](https://github.com/Exeteres/Replikit/commit/3f0271c96b6ac9cbfdb5f399ae24dc37d6286231))





## [0.11.2](https://github.com/Exeteres/Replikit/compare/v0.11.1...v0.11.2) (2020-07-24)


### Bug Fixes

* **cli:** Add forgotten dependency ([7f4a86c](https://github.com/Exeteres/Replikit/commit/7f4a86c877bdce26706b7ac38d04c2dee5da02d7))





## [0.11.1](https://github.com/Exeteres/Replikit/compare/v0.11.0...v0.11.1) (2020-07-24)


### Bug Fixes

* **cli:** Fix package.json issue ([2259e63](https://github.com/Exeteres/Replikit/commit/2259e63db0251a8c3ecbd41bd2a06a669d894d9f))






# [0.11.0](https://github.com/Exeteres/Replikit/compare/v0.10.1...v0.11.0) (2020-07-24)


### Bug Fixes

* **core:** Fix deepmerge ([132b184](https://github.com/Exeteres/Replikit/commit/132b18493e02603c195af70a2cfff0e9c31dc383))
* **sessions:** Fix some bugs in sessions package ([1ddb173](https://github.com/Exeteres/Replikit/commit/1ddb1737ca50d8ba80602dabd3a6d6de50de4ae7))
* **telegram:** Fix bug in update processing flow ([cd42838](https://github.com/Exeteres/Replikit/commit/cd4283899ec169b439bb29de58b4d5c7128f4655))


### Features

* **cli:** Add support for hooks ([f997db0](https://github.com/Exeteres/Replikit/commit/f997db0911f45c5957653357f5cf4cfb2de22e48))
* **commands:** Replace positional arguments with options in the text method of CommandBuilder ([f3a0391](https://github.com/Exeteres/Replikit/commit/f3a0391738f62c30c4fe00c0a9369a4a5112c66f))
* **example:** Update example to use hooks and new localization system ([b9f5ff0](https://github.com/Exeteres/Replikit/commit/b9f5ff02e51e3fe71b30024fd4b01013078a8ca1))
* **hooks:** Add basic hook implementation ([d786346](https://github.com/Exeteres/Replikit/commit/d786346d18eba2476794dbc165f92d9b405500a8))
* **hooks:** Add useLocale hook ([927f716](https://github.com/Exeteres/Replikit/commit/927f7165d4217aaad27eea2275f8668b1a8dc906))
* **hooks:** Redesign hooks system ([362a403](https://github.com/Exeteres/Replikit/commit/362a403fac7311a79a43f1d75346edcdfbb20a11))
* **i18n:** Replace way to use i18n ([df6abcd](https://github.com/Exeteres/Replikit/commit/df6abcd791644bc2255107d98497a7e492fb07ca))
* **messages:** Add MessageLike type ([046ca1b](https://github.com/Exeteres/Replikit/commit/046ca1b8a19308790f3e0a424a0cb9f3cb7dc7dd))
* **router:** Add ability to use final handler chain ([83ea2fe](https://github.com/Exeteres/Replikit/commit/83ea2fe74d9b322ebecf6ba8bcbf48fbb65ef973))
* **sessions:** Add sessions package ([e7a0adf](https://github.com/Exeteres/Replikit/commit/e7a0adf3bbe35091bad6dcf28395e3c389a20a83))





## [0.10.1](https://github.com/Exeteres/Replikit/compare/v0.10.0...v0.10.1) (2020-06-30)


### Bug Fixes

* **vk:** Fix execute api response ([161e355](https://github.com/Exeteres/Replikit/commit/161e355aa5854437798a5ba1499b6daabee2bdae))





# [0.10.0](https://github.com/Exeteres/Replikit/compare/v0.9.0...v0.10.0) (2020-06-29)


### Features

* **vk:** Add globalId to metadata ([9143016](https://github.com/Exeteres/Replikit/commit/9143016ff53ad6f31bf2b6c1107103d466ed1343))
* **vk:** Add group url formatter ([3d9c50b](https://github.com/Exeteres/Replikit/commit/3d9c50bbce17393536362be40834e766b5efe1b1))





# [0.9.0](https://github.com/Exeteres/Replikit/compare/v0.8.0...v0.9.0) (2020-06-28)


### Bug Fixes

* **telegram:** Fix text tokenization ([2869e48](https://github.com/Exeteres/Replikit/commit/2869e488761a80e111afce676bed04bc28f9148a))
* **vk:** Fix invalid reply field ([f477793](https://github.com/Exeteres/Replikit/commit/f47779364a81ca43f095688de27fd06556c62f37))


### Features

* Add advanced metadata processing ([54c7820](https://github.com/Exeteres/Replikit/commit/54c782021f5ebc16d784f210d273f8d7490d2af5))





# [0.8.0](https://github.com/Exeteres/Replikit/compare/v0.7.2...v0.8.0) (2020-06-27)


### Bug Fixes

* **authorization:** Fix commands extension ([aa9b255](https://github.com/Exeteres/Replikit/commit/aa9b25592201318a9e97ab57f72fb9c11364d84e))
* **commands:** Fix rest params resolution ([15e3b1b](https://github.com/Exeteres/Replikit/commit/15e3b1b1c0a6af2e2428326ded0ecd5d56472269))
* **permissions:** Add UserRoleName and MemberRoleName aliases ([b0c8199](https://github.com/Exeteres/Replikit/commit/b0c81999045660cd4ac976376c178d97ec6fb947))
* **storage:** Fix transformation of dates ([2abe05b](https://github.com/Exeteres/Replikit/commit/2abe05b91ef8c0b8d2e0c9a9ee866558a798a78c))


### Features

* **core:** Add core support for replies ([21f3318](https://github.com/Exeteres/Replikit/commit/21f3318f7bd031233856e7a1e1ddd29d73ef5f04))
* **example:** Add echo command ([bd55387](https://github.com/Exeteres/Replikit/commit/bd55387721b431d9346507458ebf435b8c0dde75))
* **messages:** Add MessageBuilder methods for working with replies ([015e3f2](https://github.com/Exeteres/Replikit/commit/015e3f23b3f166b46aecb2b98f6f447661b8576d))
* **telegram:** Add telegram support for replies ([877cc7c](https://github.com/Exeteres/Replikit/commit/877cc7c57cbf172969718d3d2ca600ac042c622d))
* **vk:** Add vk support for replies ([166a79c](https://github.com/Exeteres/Replikit/commit/166a79cdc2c7b638ca08e79d762ffdc34a6677ed))





## [0.7.2](https://github.com/Exeteres/Replikit/compare/v0.7.1...v0.7.2) (2020-06-23)

**Note:** Version bump only for package replikit





## [0.7.1](https://github.com/Exeteres/Replikit/compare/v0.7.0...v0.7.1) (2020-06-23)


### Bug Fixes

* **storage:** Fix invalid typings ([fef2cf0](https://github.com/Exeteres/Replikit/commit/fef2cf0be233d99802829c65527a9934a2371ab0))





# [0.7.0](https://github.com/Exeteres/Replikit/compare/v0.6.0...v0.7.0) (2020-06-23)


### Bug Fixes

* **authorization:** Fix extension typings and accessDenied message formatting ([fc28542](https://github.com/Exeteres/Replikit/commit/fc28542dcb84f82d20a4552ad31b6b89fb0b9ec7))
* **cli:** Fix generated package.json and tsconfig ([83854b5](https://github.com/Exeteres/Replikit/commit/83854b53c86f691613f42218a8f321270ad22f93))
* **permissions:** Fix missing storage defaults ([6e6ca9d](https://github.com/Exeteres/Replikit/commit/6e6ca9dd77267a198ebd66a019e601c508dabbcb))


### Features

* **help:** Add support for overloaded commands ([cc6b99b](https://github.com/Exeteres/Replikit/commit/cc6b99bd8a2c1ef12a791d5bb5c87269b292b83e))
* **storage:** Add embedded entities ([2c6a68b](https://github.com/Exeteres/Replikit/commit/2c6a68b969da555742021defbde9487d6857175e))





# [0.6.0](https://github.com/Exeteres/Replikit/compare/v0.5.3...v0.6.0) (2020-06-21)


### Bug Fixes

* **storage:** Fix PlainObject type ([a526999](https://github.com/Exeteres/Replikit/commit/a526999ed51c20beb848fc3ef0cc77f472af13ea))
* Fix typings ([315e2b1](https://github.com/Exeteres/Replikit/commit/315e2b1fedab922dd3e63851f33de64856a8d863))


### Features

* **permissions:** Add api for getting permission and role names ([e7cba6c](https://github.com/Exeteres/Replikit/commit/e7cba6c1d1ed6cf76916fff1afc577046c3c0d55))
* **storage:** Add more useful methods ([63e5125](https://github.com/Exeteres/Replikit/commit/63e512520c0d1092ac175af3c9be14b05a4051ae))





## [0.5.3](https://github.com/Exeteres/Replikit/compare/v0.5.2...v0.5.3) (2020-06-20)

**Note:** Version bump only for package replikit





## [0.5.2](https://github.com/Exeteres/Replikit/compare/v0.5.1...v0.5.2) (2020-06-20)

**Note:** Version bump only for package replikit





## [0.5.1](https://github.com/Exeteres/Replikit/compare/v0.5.0...v0.5.1) (2020-06-20)


### Bug Fixes

* **help:** Fix help package build ([1c1afb0](https://github.com/Exeteres/Replikit/commit/1c1afb01df9704248460c7f4a1eb72baaf8bc587))





# 0.5.0 (2020-06-20)


### Bug Fixes

* **chalk:** Fix invalid paths ([c7058a9](https://github.com/Exeteres/Replikit/commit/c7058a9fd36b44f2cc578af6dd98a1e43341a2d2))
* **cli:** Add @types/node to generated package.json ([4787912](https://github.com/Exeteres/Replikit/commit/4787912620fd2e332728a687ae92f5563fd6f350))
* **cli:** Add missing dependencies ([a5ba2c1](https://github.com/Exeteres/Replikit/commit/a5ba2c1f9ba83692b118655b519d58b14d85f76f))
* **cli:** Fix "workspaces" section in generated package.json ([3dc4214](https://github.com/Exeteres/Replikit/commit/3dc4214a8f929afca7015d9cd3942276ec779c41))
* **cli:** Fix configuration override ([1866a8a](https://github.com/Exeteres/Replikit/commit/1866a8a005055d4a375104964c3d01508ac56cef))
* **commands:** Fix validation of text parameter ([4ab05f8](https://github.com/Exeteres/Replikit/commit/4ab05f84120449aeb0a8b9d2e38d9e9c7a23bc0e))
* **i18n:** Fix invalid ru pluralization ([1ee3de9](https://github.com/Exeteres/Replikit/commit/1ee3de99923b1321ceb87af0eb8c1a3cb7884df5))
* **replikit:** Add bin section to package.json ([666ce78](https://github.com/Exeteres/Replikit/commit/666ce7866c37fb680f737663f04b358bf2b6ce3f))


### Features

* **cli:** Add build command ([5c9dc57](https://github.com/Exeteres/Replikit/commit/5c9dc57b9ac2428f4970096dcfc6ae75b2e4dd27))
* **cli:** Add scripts section and replikit as dev dependency to generated package.json ([2f5dd6f](https://github.com/Exeteres/Replikit/commit/2f5dd6f35f47f5fa50109b7155f56109b1ba3efc))
* **commands:** Rename multiline parameter to text parameter and make it possible to work with a rest parameter or instead of it ([6b2338d](https://github.com/Exeteres/Replikit/commit/6b2338d88b2b5452eacf39b690b797d30a6bf81f))
* **help:** Add help package ([68b50e9](https://github.com/Exeteres/Replikit/commit/68b50e9d04561ad037bcd2abcb5fbeffd4f2c664))






# [0.4.0](https://github.com/Exeteres/Replikit/compare/v0.3.0...v0.4.0) (2020-06-19)


### Bug Fixes

* **commands:** Fix validation of text parameter ([fa892f2](https://github.com/Exeteres/Replikit/commit/fa892f24eadf262401da9fd7f5a8dcb2750b0fdf))


### Features

* **cli:** Add build command ([0212d7f](https://github.com/Exeteres/Replikit/commit/0212d7f9c87d517b8cf220be9b32376551c3603b))





# [0.3.0](https://github.com/Exeteres/Replikit/compare/v0.2.0...v0.3.0) (2020-06-14)


### Bug Fixes

* **cli:** Add @types/node to generated package.json ([3d4fc2b](https://github.com/Exeteres/Replikit/commit/3d4fc2b1c5d0daad6040fe956d3cf164f3b1a227))
* **cli:** Fix configuration override ([d70cddb](https://github.com/Exeteres/Replikit/commit/d70cddb919469e90ed29a1bead411908bf370b57))
* **i18n:** Fix invalid ru pluralization ([fcb1599](https://github.com/Exeteres/Replikit/commit/fcb15995e152b7b901838dc468eff5f02f2cf400))


### Features

* **commands:** Rename multiline parameter to text parameter and make it possible to work with a rest parameter or instead of it ([44c5b69](https://github.com/Exeteres/Replikit/commit/44c5b69cfca82a0a7280593e6bef8b2028ca2ae0))





# [0.2.0](https://github.com/Exeteres/Replikit/compare/v0.1.0...v0.2.0) (2020-06-13)


### Bug Fixes

* **chalk:** Fix invalid paths ([fa5f2f2](https://github.com/Exeteres/Replikit/commit/fa5f2f217fe42eec37ed2c4e54080aee0f9a2818))
* **cli:** Add missing dependencies ([a655059](https://github.com/Exeteres/Replikit/commit/a65505938400bf29c2b890966a2685ac7618d989))
* **cli:** Fix "workspaces" section in generated package.json ([12aca8b](https://github.com/Exeteres/Replikit/commit/12aca8b5f729834c270abfed5606e932b987d48b))
* **replikit:** Add bin section to package.json ([5f7ec5f](https://github.com/Exeteres/Replikit/commit/5f7ec5f6efe0ca4c528be7a9484c2fab9e095728))


### Features

* **cli:** Add scripts section and replikit as dev dependency to generated package.json ([64399a2](https://github.com/Exeteres/Replikit/commit/64399a242938b1e12baef40a75cf0d6cfeec3b0f))
