using System;
using System.Collections.Generic;

namespace elims.elims;

public partial class StatusCode
{
    public int StatusCodeId { get; set; }

    public string? Status { get; set; }

    public virtual ICollection<K1Detail> K1Details { get; set; } = new List<K1Detail>();
}
