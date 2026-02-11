<script lang="ts">
    import type {ChangeEventHandler} from "svelte/elements";

    let {
        value = $bindable(),
        max,
        min,
        onchange,
    } = $props<{
        value: Date,
        max?: Date,
        min?: Date,
        onchange?: (value: Date) => void
    }>()

    const adjustDates = ()=>{
        if(max && value > max) {
            console.log('max exceeded, setting to max:',{value, max});
            value = max;
        }
        if(min && value < min) {
            console.log('min exceeded, setting to min:',{value, min});
            value = min;
        }
    }
    adjustDates();

    const formatDate = (value:Date) => value.getFullYear() + '-' + (value.getMonth() + 1) + '-' + value.getDate();

    const handler = ((event: InputEvent) => {
        console.log('running handler');
        //@ts-ignore
        const {target: {value: v}} = event;
        value = v ? new Date(v) : undefined
        adjustDates();
        onchange?.(value);
    }) as unknown as ChangeEventHandler<HTMLInputElement>;





</script>


<input
      type="date"
      max={max? formatDate(max) : undefined}
      min={min? formatDate(min) : undefined}
      value={formatDate(value)}
      onchange={handler}
>
