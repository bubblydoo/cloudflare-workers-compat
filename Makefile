all:
	npx tsc
	bash lib/node-builtin-modules/events/build.sh
	bash lib/node-builtin-modules/fs/build.sh
	bash lib/node-builtin-modules/process/build.sh
	bash lib/node-builtin-modules/string_decoder/build.sh
	bash lib/node-builtin-modules/timers/build.sh
	bash lib/node-builtin-modules/tty/build.sh
	bash lib/node-builtin-modules/util/build.sh
