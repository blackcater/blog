#PostgreSQL基本语法

PostgreSQL安装好之后，想要从console登陆，则只有postgres用户才能不要密码进行登陆。

若你是linux用户可以创建一个名为postgres的用户，然后切换到其中，使用

```shell
> psql
```

直接登陆，其他需要具体指定：

```shell
> psql -U <用户名> -d <数据库名称>
```

创建用户

```sql
> CREATE USER <name> WITH PASSWORD '<password>'
```

创建数据库

```shell
> CREATE DATABASE <dbname> OWNER <name>
```

赋予用户对数据库的权限

```shell
# 赋予name对数据库dbname的所有权限
> GRANT ALL PRIVILEGES ON DATABASE <dbname> to <name>
```

控制台命令

- \h：查看SQL命令的解释，比如\h select。
- \?：查看psql命令列表。
- \l：列出所有数据库。
- \c [database_name]：连接其他数据库。
- \d：列出当前数据库的所有表格。
- \d [table_name]：列出某一张表格的结构。
- \du：列出所有用户。
- \e：打开文本编辑器。
- \conninfo：列出当前数据库和连接的信息。

数据库操作

```sql
# 创建新表 
CREATE TABLE user_tbl(name VARCHAR(20), signup_date DATE);
# 插入数据 
INSERT INTO user_tbl(name, signup_date) VALUES('张三', '2013-12-22');
# 选择记录 
SELECT * FROM user_tbl;
# 更新数据 
UPDATE user_tbl set name = '李四' WHERE name = '张三';
# 删除记录 
DELETE FROM user_tbl WHERE name = '李四' ;
# 添加栏位 
ALTER TABLE user_tbl ADD email VARCHAR(40);
# 更新结构 
ALTER TABLE user_tbl ALTER COLUMN signup_date SET NOT NULL;
# 更名栏位 
ALTER TABLE user_tbl RENAME COLUMN signup_date TO signup;
# 删除栏位 
ALTER TABLE user_tbl DROP COLUMN email;
# 表格更名 
ALTER TABLE user_tbl RENAME TO backup_tbl;
# 删除表格 
DROP TABLE IF EXISTS backup_tbl;
```