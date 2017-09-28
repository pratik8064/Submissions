#include <linux/module.h>
#include <linux/printk.h>
#include <linux/sched.h>
#include <linux/moduleparam.h>
#include <linux/list.h>

int processID;
module_param(processID, int, S_IRUSR);
static int __init initFunction(void){
	struct task_struct *currentTask;
	struct task_struct *child;
	struct list_head *listHead;
	struct task_struct *Parent;
	printk(KERN_INFO "Process ID received is %d", processID);
	for_each_process(currentTask){
		if(currentTask->pid > processID){
			printk(KERN_INFO "ProcessType:\t\t   Name     PID   State   Priority   StaticP   NormalP");
			printk(KERN_INFO "Current P  :%20s   %5d   %5ld   %8d   %7d   %7d\n", currentTask->comm, currentTask->pid, currentTask->state, currentTask->prio, currentTask->static_prio, currentTask->normal_prio);	
			Parent = currentTask->parent;			
			printk(KERN_INFO "parent P   :%20s   %5d   %5ld   %8d   %7d   %7d\n", Parent->comm, Parent->pid, Parent->state, Parent->prio, Parent->static_prio, Parent->normal_prio);			
			list_for_each(listHead, &currentTask->children) {
    				child = list_entry(listHead, struct task_struct, sibling);
				printk(KERN_INFO "child P    :%20s   %5d   %5ld   %8d   %7d   %7d\n", child->comm, child->pid, child->state, child->prio, child->static_prio, child->normal_prio);
			}
			printk(KERN_INFO "\n");
		}
	}
	return 0;
}

static void __exit exitFunction(void){
	printk(KERN_INFO "Exiting now\n");
}

module_init(initFunction);
module_exit(exitFunction);
MODULE_LICENSE("GPL");