## Pros and cons of DBaaS or DIY database handling

### DBaaS

Pros:
* Easy setup, lower workload
* Easier maintaing
* High availability
* Easy scaling
* Usually comes with built in security measures
* Depending on the volume of data and requests a pay as you go pricing agreement can be more cost efficient.
* Easy backups

Cons:
* Not as customizable as DIY, less control
* Depending on dataset size can incur higher costs at bigger datasets
* If the data needs to be stored on-site, this is not a suitable option
* Dependence on another company (pricing can change, terms of service can change, there might be a big data leak, bankcruptcy) a.k.a vendor locked


### DIY (also including options like DB container in Kubernetes, but not Google SQL)

Pros:
* Highly customizable
* Full control
* Can be deployed on-site, increasing security in certain cases
* A containerized database in Kubernetes can be cost effective
* For bigger projects after the initial investment can be more cost effective
* Scaling is easy if the solution is something like a containerized Kubernetes database.

Cons:
* More work on setup
* More work in maintaining
* More complex, requires more knowledge on setup
* Can be insecure if handled carelessly
* Scaling might be an issue, especially if using own hardware
* Higher initial cost for self hosted solutions
* Complex backup setups even with a containerized Kubernetes solution



