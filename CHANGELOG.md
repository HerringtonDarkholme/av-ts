0.9.0
----
New Feature:
Support tsx

0.8.0
----
New Feature:
p({type: Number}) no longer requires casting.

0.7.0
---
BREAKING CHANGE:

You need to turn on `allowSyntheticDefaultImports` in tsconfig.json

0.6.0
----

BREAKING CHANGE:
 1. @Watch decorator is changed to decorate watch handler, rather than property being wacthed.
 This new API does not require annotating Component type in generic and can still keep watch handler type checked. More info in https://github.com/HerringtonDarkholme/av-ts/issues/5#issuecomment-257159378.
