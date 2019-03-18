Replace regex (one entry per line)

```json
'
\'

^([^ ]+) \(\*\): (.+)
{ stronglyAligned: true, name: '$1', description: '$2' },

^([^{:]+): (.+)
{ stronglyAligned: false, name: '$1', description: '$2' },

. ' }
.' }
```
