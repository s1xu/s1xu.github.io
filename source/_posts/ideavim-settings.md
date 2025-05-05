---
title: 记录ideavim设置
date: 2024-07-13 15:31:22
updated: 2024-07-13 15:31:22
categories: jetbrains
tags: jetbrains
---

因为习惯了vim操作，chrome中使用`Vimium`，所以寻思在常用的编辑器中也使用vim操作，所以有了如下记录：

## 1.下载ideavim插件

## 2.查看idea自带action

1. 使用`:actionlist`可以查询所有命令，但是不能确定是具体映射的什么操作，所以不推荐

2. double shift 唤醒窗口搜索`track action ids` 打开开关，然后正常操作你需要查看的功能，右下角会提示当前的action id
复制然后在`.ideavimrc`中设置映射的快捷键（推荐）

例如：

1. 我的`ma`是设置书签，设置后我想重命名这个书签的名称方便查找

2. double shift后打开`track action ids` 开关后，右键书签位置选择`Rename BookMark` ，此时右下角会弹出当前操作对应的Action id是`EditBookmark` 

3. `Copy Action Id` 在 `.ideavimrc`中

     ```
      " bookmark 切换书签
      nmap ma <action>(ToggleBookmark)
      nmap rma <action>(EditBookmark)
     ```
## 3.目录使用hjkl展开关闭
``` 
" 设置目录树快捷键映射
set NERDTree
let g:NERDTreeMapActivateNode = 'l'
let g:NERDTreeMapCloseDir = 'h'
```

## 4.自动切换输入法
vim 在退出`insert`模式自动后切换为原来的输入法
[依赖`IdeaVimExtension`插件](https://github.com/hadix-lin/ideavim_extension)
```
let context_aware=1
set keep-english-in-normal-and-restore-in-insert
```
设置后重启生效
>:set keep-english-in-normal 开启输入法自动切换功能
>:set keep-english-in-normal-and-restore-in-insert 回到insert模式时恢复输入法
>:set nokeep-english-in-normal-and-restore-in-insert 保留输入法自动切换功能，但是回到insert模式不恢复输入法
>:set nokeep-english-in-normal 关闭输入法自动切换功能
>
> context_aware=1 回到insert模式的时候，如果光标两侧都是非ASCII字符才会恢复输入法，这是1.6.5的默认设置。
> context_aware=0 回到insert模式就恢复输入法


<br>
<br>
<details>
    <summary>记录我的.ideavimrc配置(cick to show)</summary>

```
" Plug 'preservim/nerdtree'
Plug 'easymotion/vim-easymotion'

" 下列插件需要在 IDEA 中下载
" ideaVim
" IdeaVim-EasyMotion
" IdeaVimExtension
" which-key
" CodeGlance Pro
" TranslateAction

" ---------- 基本配置 ----------
let mapleader = " "

set easymotion
set scrolloff=15
set incsearch
set ignorecase
set hlsearch
set surround                " 环绕 ysiw" yss"  cs ds
set selectmode=key
set keymodel+=startsel,stopsel,stopselect " shift+方向键选择
" set number relativenumber

" ---------- 光标行为和快捷键配置 ----------
" set keep-english-in-normal
" set NERDTree
" 设置常用快捷键映射：在普通模式下，按回车键增加一行
nmap <CR> o<Esc>
nmap <S-Enter> O<Esc>
nnoremap <F1> :action QuickJavaDoc<CR>
nnoremap <S-C-J> :m +1<CR>
nnoremap <S-C-k> :m -2<CR>
inoremap <S-C-J> <Esc> :m +1<CR>gi
inoremap <S-C-k> <Esc> :m -2<CR>gi
xnoremap <S-C-J> :m '>+1<cr>gv=gv
xnoremap <S-C-k> :m '<-2<cr>gv=gv
" set timeoutlen=50
" inoremap jj <Esc>
" inoremap jk <Esc>
nnoremap [[ :action Back<CR>
noremap  ]] :action Forward<CR>
nmap ge <action>(GotoNextError)
nmap gt <action>(GotoTest)
nmap ga <action>(GotoImplementation)
nmap gh <action>(ShowErrorDescription)
nmap gu <action>(MethodUp)
nmap gn <action>(MethodDown)
nmap <leader>nl :nohlsearch<CR>
nmap <leader>nd <action>(NewDir)
nmap <leader>nc <action>(NewClass)

" ---------- Easymotion 插件配置 ----------
" 在普通模式输入s后输入要跳转到单词首字母(或多输入几个字母)
nmap s <Plug>(easymotion-bd-n)

" ---------- 代码重构和调试快捷键 ----------
" 提取方法、常量、字段、变量的快捷键映射
vmap <leader>em <action>(ExtractMethod)
vmap <leader>ec <action>(IntroduceConstant)
vmap <leader>ef <action>(IntroduceField)
vmap <leader>ev <action>(IntroduceVariable)
" 切换断点、调试等操作
nmap <leader>dp <Action>(ToggleLineBreakpoint)
nmap <leader>db <Action>(Debug)
nmap <leader>sd <Action>(Stop)
nmap <leader>rc :action RunClass<CR>
nmap <leader>rr <action>(Rerun)
nmap <leader>rt <action>(RerunTests)
nmap <leader>rn <action>(RenameElement)
nmap <leader>ru <action>(Run)
nmap <leader>ss <action>(FileStructurePopup)
nmap <leader>sb <action>(ShowBookmarks)
nmap <leader>sp <action>(ParameterInfo)
nmap <leader>st <action>(Stop)

" ---------- 标签页、书签和窗口管理 ----------
nnoremap H ^
nnoremap L $
nmap K <action>(NextTab)
nmap J <action>(PreviousTab)
nnoremap <leader>me :action ToggleFullScreen<CR>
nnoremap <leader>o :action RecentProjectListGroup<CR>
nmap ma <action>(ToggleBookmark)
nmap rma <action>(EditBookmark)
nmap tm <action>(ActivateBookmarksToolWindow)
nmap <leader>ca <action>(CloseAllEditors)
nmap <leader>cd :action CloseEditor<CR>
nmap <leader>cc <action>(Clo¢seProject)
nmap <leader>co :action CloseAllEditorsButActive<CR>
nmap <leader>e <action>(ActivateProjectToolWindow)
" ---------- 文件和项目管理快捷键 ----------
" 打开文件和项目视图，跳转到文件
nmap <leader>ff <action>(GotoFile)
nmap <leader>fl <action>(SelectInProjectView)
nmap <leader>ft <action>(FindInPath)
nmap <leader>fc <action>(GotoAction)
" 重新格式化代码
nmap <leader>fm <action>(ReformatCode) \| <action>(OptimizeImports)

" ---------- Git ----------
nmap <leader>gr :action Vcs.RollbackChangedLines<CR>
nmap <leader>gc :action GenerateConstructor<CR>
nmap <leader>gg :action GenerateGetter<CR>
nmap <leader>gs :action GenerateSetter<CR>
nmap <leader>ga <action>(GenerateGetterAndSetter)
nmap <leader>ge <action>(GenerateEquals)
nmap <leader>gt <action>(Actions.ActionsPlugin.GenerateToString)
nmap <leader>hs <action>(Vcs.ShowTabbedFileHistory)
nmap <leader>gd <action>(Annotate)
" 快速查找文件和跳转到函数
nmap <leader>i f(a

" ---------- NERDTree 配置 ----------
" 打开/关闭 NERDTree 文件资源管理器
nnoremap <C-n> :NERDTree<CR>
nnoremap <C-t> :NERDTreeToggle<CR>

" 定位当前文件在 NERDTree 中的位置
nnoremap <C-f> :NERDTreeFind<CR>

" 通过 NERDTree 切换文件
nnoremap <leader>nn :NERDTreeFocus<CR>
nmap <C-n> :NERDTree<CR>

" ---------- 其他快捷键 ----------
" 快速翻译
nmap <leader>t <action>($EditorTranslateAction)
vmap <leader>t <action>($EditorTranslateAction)
nmap <leader>zo <action>(ExpandAllRegions)
nmap <leader>zc <action>(CollapseAllRegions)

" 关闭/拆分窗口操作
nmap <leader>wml <action>(MoveTabRight)                         " 向右拆分标签页
nmap <leader>wmd <action>(MoveTabDown)                          " 向下拆分标签页
nmap <leader>wmo <action>(MoveEditorToOppositeTabGroup)         " 在另一边打开（前提是有另一边的分割窗口）
nmap <leader>wmc <action>(SplitVertically)                      " 向右复制标签页
nmap <leader>wa <action>(UnsplitAll)                            " 取消所有分割窗口
nmap <leader>wc <c-w>c                                          " 关闭当前窗口或分割窗格
nmap <leader>wu <action>(Unsplit)                               " 取消拆分当前分割窗口
nmap <leader>j <c-w>j                                           " wl: MoveToRight-跳转到右边的窗口(<c-w>l)
nmap <leader>h <c-w>h                                           " wh: MoveToLeft-跳转到左边的窗口(<c-w>h)
nmap <leader>k <c-w>k                                           " wk: MoveToUp-跳转到上边的窗口(<c-w>k)
nmap <leader>l <c-w>l                                           " wj: MoveToDown-跳转到下边的窗口(<c-w>j)

" 复制、粘贴操作简化
vmap <leader>dd "+d
nmap <leader>y "+yy
vmap <leader>y "+y
nmap <leader>p "+p
nmap <leader>P "+P
```
</details>


## 5.参考

- Google
- [ideavim-EasyMotion](https://github.com/AlexPl292/IdeaVim-EasyMotion)
