all:
	bash modules/events/build.sh
	bash modules/fs/build.sh
	bash modules/process/build.sh
	bash modules/string_decoder/build.sh
	bash modules/timers/build.sh
	bash modules/tty/build.sh
	bash modules/util/build.sh
	node build.mjs
