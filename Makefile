# Makefile for Docker Nginx PHP Composer MySQL

include .env

# MySQL
MYSQL_DUMPS_DIR=storage/db/dumps

help:
	@echo ""
	@echo "usage: make COMMAND"
	@echo ""
	@echo "Commands:"
	@echo "  start        Create and start containers"
	@echo "  populate     Recreate and populate database"
	@echo "  update       Update PHP dependencies with composer"
	@echo "  test         Test application"
	@echo "  check        Check the API with PHP Code Sniffer (PSR2)"
	@echo "  autoload     Update PHP autoload files"
	@echo "  dump         Create backup of whole database"
	@echo "  restore      Restore backup from whole database"
	@echo "  class        Generate initial code from template files"
	@echo "  doc          Generate documentation of API"
	@echo "  logs         Follow log output"
	@echo "  clean        Stop docker and clean generated folder"
	@echo "  purge        Clean and remove vendor folder"
	@echo "  stop         Stop and clear all services"

init:
	@echo "Initializing..."
	@mkdir -p $(MYSQL_DUMPS_DIR)

doc:
	@docker-compose exec -T php ./vendor/bin/phpdoc --progressbar --sourcecode -d app -t docs/api
	@make -s reset

clean: stop
	@rm -Rf storage
	@rm -Rf docs/api

purge: clean
	@rm -Rf vendor
	@rm -Rf composer.lock

check:
	@echo "Checking the standard code..."
	@docker-compose exec -T php ./vendor/bin/phpcs -v --standard=PSR2 app

update:
	@docker run --rm -v $(shell pwd):/app composer update

autoload:
	@docker run --rm -v $(shell pwd):/app composer dump-autoload

start: init reset
	docker-compose up -d

stop:
	@docker-compose down -v

logs:
	@docker-compose logs -f

populate:
	@$(shell mkdir -p $(MYSQL_DUMPS_DIR))
	@$(shell cat database/model/script.sql > $(MYSQL_DUMPS_DIR)/populate.sql)
	@$(shell cat database/model/insert.sql >> $(MYSQL_DUMPS_DIR)/populate.sql)
	@$(shell perl -0777 -i.original -pe "s/\`syncdb\`/\`$(MYSQL_DATABASE)\`/igs" $(MYSQL_DUMPS_DIR)/populate.sql)
	@rm -f $(MYSQL_DUMPS_DIR)/populate.sql.original
	@make -s reset
	@docker exec -i $(shell docker-compose ps -q smysqldb) mysql -u"$(MYSQL_ROOT_USER)" -p"$(MYSQL_ROOT_PASSWORD)" < $(MYSQL_DUMPS_DIR)/populate.sql 2>/dev/null

dump:
	@mkdir -p $(MYSQL_DUMPS_DIR)
	@docker exec $(shell docker-compose ps -q smysqldb) mysqldump -B "$(MYSQL_DATABASE)" -u"$(MYSQL_ROOT_USER)" -p"$(MYSQL_ROOT_PASSWORD)" --add-drop-database > $(MYSQL_DUMPS_DIR)/db.sql 2>/dev/null
	@make -s reset

restore:
	@docker exec -i $(shell docker-compose ps -q smysqldb) mysql -u"$(MYSQL_ROOT_USER)" -p"$(MYSQL_ROOT_PASSWORD)" < $(MYSQL_DUMPS_DIR)/db.sql 2>/dev/null

test:
	@docker-compose exec -T php ./vendor/bin/phpunit --colors=always --configuration ./ --no-coverage ./tests

class:
	@mkdir -p $(MYSQL_DUMPS_DIR)
	@cp -f database/model/script.sql 														$(MYSQL_DUMPS_DIR)/script_no_trigger.sql
	@perl -0777 -i.original -pe "s/USE \`syncdb\`;\r?\n//igs" 								$(MYSQL_DUMPS_DIR)/script_no_trigger.sql
	@perl -0777 -i.original -pe "s/\`syncdb\`\.//igs" 										$(MYSQL_DUMPS_DIR)/script_no_trigger.sql
	@perl -0777 -i.original -pe "s/' \/\* comment truncated \*\/ \/\*([^\*]+)\*\//\1'/igs"	$(MYSQL_DUMPS_DIR)/script_no_trigger.sql
	@perl -0777 -i.original -pe "s/([^\\\\\][\\\\\])([^\\\\\'])/\1\\\\\\\\\2/igs"			$(MYSQL_DUMPS_DIR)/script_no_trigger.sql
	@rm -f $(MYSQL_DUMPS_DIR)/script_no_trigger.sql.original
	@java -jar utils/SQLtoClass.jar -p utils/config.properties -t utils/template -o storage/app/generated

reset:
	@chmod 777 storage

.PHONY: clean test check init
