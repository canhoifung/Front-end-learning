# 相关教程

[廖雪峰Git教程](https://www.liaoxuefeng.com/wiki/896043488029600)

# Git主要操作

#### 1.安装Git后规定本机用户名和用户邮箱地址

`$ git config --global user.name "Your Name"`

`$ git config --global user.email "email@example.com`   

#### 2.创建新文件夹

`$ mkdir learngit`

版本库文件夹最好其与父级不要有中文路径

#### 3.进入learngit文件夹

`$ cd learngit`

> cd . 进入本级目录
>
> cd ./abc 进入本级目录下的abc文件夹
>
> cd .. 返回本级目录的上一级
>
> cd ~ 进入用户目录

#### 4.显示当前目录

`$ pwd`

#### 5.创建版本库

`$ git init`

其下会出现一个.git的目录，是Git用于跟踪管理版本库，不要随意修改

#### 6.将文件添加至版本库

`$ git add readme.txt`

可以一次add多个文件或多次add不同文件

`$ git add file2.txt file3.txt`

`git add .`，将所有修改添加到暂存区

#### 7.将文件提交到仓库

`$ git commit -m “write a readme file”`

`-m`后面的内容是本次提交的说明，可以输入任意内容，方便从历史记录里找到改动记录

`git commit`命令执行成功后会告诉你，`1 file changed`：1个文件被改动（我们新添加的readme.txt文件）；`2 insertions`：插入了两行内容（readme.txt有两行内容）。

#### 8.查看仓库目前状况

`git status`命令可以让我们时刻掌握仓库当前的状态

#### 9.查看修改内容

`git diff readme.txt`

`git diff`顾名思义就是查看difference，显示的格式正是Unix通用的diff格式

比较的是工作区与暂存区（上一次`git add`的内容）

`git diff --cahced`比较的是暂存区与分支（master，上一次`git commit`的内容）

#### 10.版本回退

`git log`查看历史提交版本，显示从最近到最远的提交日志

`git log --pretty=oneline`显示一行信息，简化输出内容

显示的`commit id`是版本号

> Git中，使用`HEAD`表示当前版本，上一个版本是`HEAD^`，上上版本是`HEAD^^`，上100个版本可以写作`HEAD~100`

`git reset` 用于回退版本，如`git reset --hard HEAD^`

> 回退后使用`git log`查看版本会只有最初到当前回退版本，若要回退到最新的版本，若命令行窗口未关闭可以找到对应版本号的`commit id`，使用`git reset --hard 1094a`，其中1094a对应`commit id` 前五位

若已经关闭了命令行窗口，则使用

`git reflog`可以查看每一次命令

#### 11.放弃修改

1. 若改乱了工作区的内容，想直接丢弃工作区的修改`git checkout -- readme.txt`将readme.txt文件在工作区的修改全部撤销
2. 若将修改内容添加到了暂存区，使用`git reset HEAD readme.txt`将暂存区的修改回退到工作区，再使用步骤1
3. 若已经提交到了版本库，则使用`git reset`进行版本回退

> `git checkout -- readme.txt`用暂存区里的版本替换工作区的版本

#### 12.查看文件内容

`cat readme.txt`

#### 13.删除文件

`rm readme.txt`在工作区中删除readme.txt

`git rm readme.txt`在暂存库中删除该文件，并`git commit`完成版本更新

#### 14.建立远程仓库

1. `ssh-keygen -t -rsa -C “youremail@example.com”`用于创建SSH Key。在用户主目录下，会有一个.ssh目录，其内有`id_rsa`与`id_rsa.pub`两个文件。`id_rsa`是私钥，不能泄露，`id_rsa.pub`是公钥，可以告诉他人。
2. 登陆GitHub，打开设置添加SSH Keys，将`id_rsa.pub`的公钥添加

#### 15.添加远程库

1. 在GitHub建立新的repository，在本地仓库下运行命令：

   `$ git remote add origin https://github.com/canhoifung/learngit.git`

   此时本地仓库与GitHub的库完成关联，`origin`即为远程库的名字，为GitHub的默认叫法

2. 将本地库的内容推送到远程库上：

   `git push -u origin master`

   把本地库的内容推送到远程，用`git push`命令，实际上是把当前分支`master`推送到远程。

   由于远程库是空的，我们第一次推送`master`分支时，加上了`-u`参数，Git不但会把本地的`master`分支内容推送的远程新的`master`分支，还会把本地的`master`分支和远程的`master`分支关联起来，在以后的推送或者拉取时就可以简化命令。

3. 此后本地进行了修改提交，可以通过命令

   `git push origin master`

   进行将本地`master`分支的最新修改推送至GitHub

#### 16.查看当前工作目录下的内容

`ls`

#### 17.GitHub地址相关

GitHub给出的地址不止一个，还可以用`https://github.com/michaelliao/gitskills.git`这样的地址。实际上，Git支持多种协议，默认的`git://`使用ssh，但也可以使用`https`等其他协议。

使用`https`除了速度慢以外，还有个最大的麻烦是每次推送都必须输入口令，但是在某些只开放http端口的公司内部就无法使用`ssh`协议而只能用`https`。

Git支持多种协议，包括`https`，但通过`ssh`支持的原生`git`协议速度最快。

即`git@github.com:canhoifung/对应repository`

#### 18.创建与合并分支

1. `git checkout -b dev`创建并切换至`dev`分支，相当于`git branch dev`+`git checkout dev`

2. `git branch`用于查看当前分支，会列出所有分支，当前分支前标注`*`号
3. `git checkout master`切换分支，现动作为切换至`master`分支
4. `git merge dev`合并指定分支到当前分支
5. `git branch -d dev`删除指定分支
6. `git branch -D dev`强行删除指定分支

> 创建并切换至新的`dev`分支，可以使用`git switch -c dev`
>
> 直接切换到已有的`master`分支，可以使用`git switch master`
>
> 即可用`switch`替换`checkout`命令

#### 19.解决冲突

当Git无法自动合并分支，需先手动解决冲突，再提交

`git log --graph`可以看到分支合并图

> 使用`git log`可能会出现很大串更新内容，使用`q`退出

#### 20.分支合并两种方法差异

1. `git merge dev`默认使用`Fast forward`模式，这种模式下删除分支后，会丢掉分支信息
2. `git merge --no-ff -m"merge with no-ff" dev`，表示强制禁用`Fast forward`模式，但会在merge时生成一个新的`commit`，因此需要使用加上`-m`参数
3. 方法1使用 `git log`看不出合并历史，方法2可以

#### 21.储存当前工作内容

`git stash`将当前工作现场存起来，便于突然接到某个工作而当前工作又无法提交

`git stash list`可以在切换回工作分支后查看工作现场内容

恢复工作内容方式：

1. `git stash apply`，使用这种方法恢复后，`stash`的内容并不删除，需要使用`git stash drop`进行删除
2. `git stash pop`，使用这种方法恢复后，同时会将`stash`的内容删除
3. `git stash apply stash@{0}`，用于恢复指定的`stash`

#### 22.将对master进行的某项修改（如BUG修复）更新到dev分支上

`git cherry-pick <commit>`，用于复制一个特定的提交到当前分支

#### 23.推送分支和抓取分支

`git remote`，查看远程库的信息，远程仓库默认名为`origin`

`git remote rm origin`，删除已关联的名为`origin`的远程库

`git remote -v`，查看详细信息，可以看到`fetch`与`push`的`origin`地址（如果没有推送权限则看不到`push`的地址

`git push origin master`，将`master`分支推送到远程库（可以选取其他分支如`dev`）

`git checkout -b dev origin/dev`，创建远程`origin`的`dev`分支到本地

`git pull`，将最新的提交抓取下来

#### 24.多人协作工作模式

1. 首先，可以试图用`git push origin <branch-name>`推送自己的修改；
2. 如果推送失败，则因为远程分支比你的本地更新，需要先用`git pull`试图合并；
3. 如果合并有冲突，则解决冲突，并在本地提交；
4. 没有冲突或者解决掉冲突后，再用`git push origin <branch-name>`推送就能成功！

> 如果`git pull`提示`no tracking information`，则说明本地分支和远程分支的链接关系没有创建，用命令`git branch --set-upstream-to <branch-name> origin/<branch-name>`。

#### 25.标签管理

`git tag <name>`，切换到需要打标签的分支上，使用该指令为标签打标签，如`v1.0`

`git tag`，查看所有标签

`git show <tagname>`，查看标签信息，包括说明文字

`git tag -a v0.1 -m “version 0.1 released” 1094adb`，创建带有说明的标签，用`-a`指定标签名，`-m`，指定说明文字

> 若要对历史版本添加`tag`，则使用`git log --pretty=oneline --abbrev-commit`，查看对应的`commit id`，然后使用`git tag v0.9 f52c633`，对对应版本打上标签

`git tag -d v0.1`，删除标签，标签不会自动推送到远程，可以在本地安全删除

`git push origin <tagname>`，推送某个标签到远程

`git push origin --tags`，一次性推送全部尚未推送到远程的本地标签

`git push origin :refs/tags/v0.9`，删除远程标签

#### 26.忽略特殊文件

[忽略特殊文件](https://www.liaoxuefeng.com/wiki/896043488029600/900004590234208)

#### 27.配置别名

[配置别名](https://www.liaoxuefeng.com/wiki/896043488029600/898732837407424)

`git config --global alias.lg "log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit" `